<?php

declare(strict_types=1);

namespace App\Services\Turn;

use App\Core\HttpStatus;
use App\Domain\Entities\Turn\TurnEntity;
use App\DTOs\Turns\Responses\TurnDetailResponse;
use App\Exceptions\Turn\TurnException;
use App\Domain\Enums\{BarberStatusEnum, ClientStatusEnum, OwnerTypeEnum};
use App\Domain\Queue\{QueueScheduler, ScheduledQueue};
use App\DTOs\Turns\Requests\{CreateTurnMemberRequest, CreateTurnRequest};
use App\Repositories\{
    Barber\BarberRepository,
    Barbershop\BarbershopClientRepository,
    Turn\ClientTurnRepository,
    Turn\TurnRepository,
    ClientGroupRepository,
    GroupMemberRepository
};
use App\Services\Barbershop\{BarbershopClientService, BarbershopService};

class TurnService extends BaseTurnService
{
    public function __construct(
        private readonly TurnRepository $turnRepository,
        private readonly BarberRepository $barberRepository,
        private readonly BarbershopClientRepository $barbershopClientRepository,
        private readonly ClientTurnRepository $clientTurnRepository,
        private readonly ClientGroupRepository $clientGroupRepository,
        private readonly GroupMemberRepository $groupMemberRepository,
        private readonly BarbershopService $barbershopService,
        private readonly BarbershopClientService $barbershopClientService,
    ) {}

    // Private helpers

    private function scheduledQueue(int $barbershopId): ScheduledQueue
    {
        return $this->getScheduledQueue($this->turnRepository, $barbershopId);
    }

    private function validateTurnExists(int $turnId): TurnEntity
    {
        $turn = $this->turnRepository->getById($turnId);
        if ($turn === null) {
            throw new TurnException('Turn not found', HttpStatus::NotFound);
        }

        return $turn;
    }

    private function validateBarberIsAccepting(int $barberId): void
    {
        $barber = $this->barberRepository->getById($barberId);
        if ($barber === null) {
            throw new TurnException('Barber not found', HttpStatus::NotFound);
        }

        if ($barber->currentStatus->value !== BarberStatusEnum::Active->value) {
            throw new TurnException('Barber is not active', HttpStatus::UnprocessableEntity);
        }

        if (!$barber->isAccepting) {
            throw new TurnException('Barber is not accepting new clients', HttpStatus::UnprocessableEntity);
        }
    }

    private function promoteToInService(TurnEntity $turn): bool
    {
        // Only promote on queue owners
        if ($turn->ownerStatus->value !== ClientStatusEnum::OnQueue->value) {
            return false;
        }

        $ownerId = $turn->ownerId->value;
        $newStatus = ClientStatusEnum::InService->value;

        if ($turn->ownerType->value === OwnerTypeEnum::Client->value) {
            $this->groupMemberRepository->updateClientStatus($ownerId, $newStatus);
        } else {
            $this->groupMemberRepository->updateMemberStatus($ownerId, $newStatus);
        }

        return true;
    }

    private function buildTurnResponse(
        TurnEntity $turn,
        ScheduledQueue $scheduled,
    ): TurnDetailResponse {
        return TurnDetailResponse::fromEntity(
            $turn,
            ['position' => $scheduled->findTurnPosition($turn->id->value)]
        );
    }

    // Controller exposed methods

    public function getTurn(int $turnId): TurnDetailResponse
    {
        $turn = $this->validateTurnExists($turnId);
        $scheduled = $this->scheduledQueue($turn->barbershopId->value);
        return $this->buildTurnResponse($turn, $scheduled);
    }

    /**
     * @param null|CreateTurnMemberRequest[] $groupMembers
     *
     * @return TurnDetailResponse[]
     */
    private function orchestrateTurnCreation(int $barbershopId, int $clientId, ?int $barberId, ?array $groupMembers): array
    {
        // Load current queue state
        [$slots, $unassigned] = $this->turnRepository->getBarberSlots($barbershopId);
        QueueScheduler::schedule($slots ?? [], $unassigned ?? []);

        // Create client group
        $groupId = null;
        if ($groupMembers !== null) {
            $groupId = $this->clientGroupRepository->createGroup($clientId);
        }

        // Create leader turn
        $leaderTurnId = $this->turnRepository->createClientTurn(
            $barbershopId,
            $clientId,
            $barberId,
            $groupId
        );

        // Set leader status
        $this->groupMemberRepository->updateClientStatus($clientId, ClientStatusEnum::OnQueue->value);

        // Create member turns
        $createdTurnIds = [$leaderTurnId];
        if ($groupMembers !== null && $groupId !== null) {
            foreach ($groupMembers as $groupMember) {
                $memberId = $this->groupMemberRepository->createMember(
                    $groupId,
                    $groupMember->memberName->value
                );

                $memberTurnId = $this->turnRepository->createMemberTurn(
                    $barbershopId,
                    $memberId,
                    $groupId,
                    $groupMember->barberId?->value,
                );

                $createdTurnIds[] = $memberTurnId;
            }
        }

        // Promote position-1 turns
        $freshScheduled = $this->scheduledQueue($barbershopId);
        foreach ($createdTurnIds as $turnId) {
            if ($freshScheduled->findTurnPosition($turnId) !== 1) {
                continue;
            }

            $turn = $this->turnRepository->getById($turnId);
            if ($turn !== null) {
                $this->promoteToInService($turn);
            }
        }

        // Build response
        $finalScheduled = $this->scheduledQueue($barbershopId);
        return array_map(
            fn (int $turnId): TurnDetailResponse => $this->buildTurnResponse(
                $this->turnRepository->getById($turnId),
                $finalScheduled
            ),
            $createdTurnIds
        );
    }

    /** @return TurnDetailResponse[] */
    public function createTurn(CreateTurnRequest $request): array
    {
        // Validate barbershop
        $barbershopId = $request->barbershopId->value;
        $this->barbershopService->validateBarbershopExists($barbershopId);

        // Validate client
        $clientId = $request->clientId->value;
        $client = $this->barbershopClientService->validateBarbershopClientExists($clientId);

        if ($client->currentStatus->value !== ClientStatusEnum::AtBarbershop->value) {
            throw new TurnException(
                'Client must have status \'at_barbershop\' to join the queue',
                HttpStatus::UnprocessableEntity
            );
        }

        // Validate barber
        $barberId = $request->barberId?->value;
        if ($barberId !== null) {
            $this->validateBarberIsAccepting($barberId);
        }

        return $this->turnRepository->transaction(
            fn () => $this->orchestrateTurnCreation(
                $barbershopId,
                $clientId,
                $barberId,
                $request->groupMembers
            )
        );
    }

    private function orchestrateTurnDeletion(TurnEntity $turn): void
    {
        $ownerId = $turn->ownerId->value;
        $ownerStatus = $turn->ownerStatus->value;
        $ownerBarberId = $turn->barberId;
        $affectedBarberIds = array_filter([$ownerBarberId?->value]);

        // Delete client turn
        if ($turn->ownerType->value === OwnerTypeEnum::Client->value) {
            $this->turnRepository->delete($turn->id->value);

            // Delete group and turns if client is leader
            $groupId = $this->clientGroupRepository->getGroupIdByLeaderId($ownerId);
            if ($groupId !== null) {
                $memberTurns = $this->clientTurnRepository->getAllByGroupId($groupId);

                // Collect barber ids before deletion
                foreach ($memberTurns as $memberTurn) {
                    $barberId = $memberTurn->barberId;
                    if ($barberId !== null) {
                        $affectedBarberIds[] = $barberId->value;
                    }
                }

                $this->clientGroupRepository->delete($groupId);
            }

            // Update client status
            if ($ownerStatus === ClientStatusEnum::Waiting->value) {
                $this->barbershopClientRepository->updateBarbershopStatus(
                    clientId: $ownerId,
                    barbershopId: null,
                    currentStatus: ClientStatusEnum::Default->value
                );
            } elseif (
                \in_array($ownerStatus, [
                    ClientStatusEnum::OnQueue->value,
                    ClientStatusEnum::InService->value,
                ], true)
            ) {
                $this->groupMemberRepository->updateClientStatus(
                    clientId: $ownerId,
                    currentStatus: ClientStatusEnum::AtBarbershop->value
                );
            }
        } elseif (
            \in_array($ownerStatus, [
                ClientStatusEnum::OnQueue->value,
                ClientStatusEnum::Waiting->value,
                ClientStatusEnum::InService->value,
            ], true)
        ) {
            // Delete member and turn
            $this->groupMemberRepository->delete($ownerId);
        }

        if (empty($affectedBarberIds) && $ownerBarberId !== null) {
            return;
        }

        $scheduled = $this->scheduledQueue($turn->barbershopId->value);

        // Add all possible barber ids if owner barber is not specified
        if ($ownerBarberId === null) {
            foreach ($scheduled->slotsById as $barberId => $_) {
                $affectedBarberIds[] = $barberId;
            }
        }

        // Promote next turns for each affected barber
        foreach (array_unique($affectedBarberIds) as $barberId) {
            $queue = $scheduled->queueOf($barberId);
            foreach ($queue as $turn) {
                $promoted = $this->promoteToInService($turn);
                if ($promoted) {
                    break;
                }
            }
        }
    }

    public function deleteTurn(int $turnId): void
    {
        $turn = $this->validateTurnExists($turnId);
        $this->turnRepository->transaction(
            fn () => $this->orchestrateTurnDeletion($turn)
        );
    }
}
