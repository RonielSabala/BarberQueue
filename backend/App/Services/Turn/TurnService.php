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

final readonly class TurnService extends BaseTurnService
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

    private function setOwnerStatus(TurnEntity $turn, string $newStatus): void
    {
        $ownerId = $turn->ownerId->value;

        // Update status
        if ($turn->ownerType->value === OwnerTypeEnum::Client->value) {
            $this->groupMemberRepository->updateClientStatus($ownerId, $newStatus);
        } else {
            $this->groupMemberRepository->updateMemberStatus($ownerId, $newStatus);
        }
    }

    private function promoteToInService(TurnEntity $turn, int $barberId): bool
    {
        // Only promote on queue owners
        if ($turn->ownerStatus->value !== ClientStatusEnum::OnQueue->value) {
            return false;
        }

        $this->setOwnerStatus($turn, ClientStatusEnum::InService->value);

        // Assign barber to this turn
        if ($turn->barberId === null) {
            $this->turnRepository->updateBarberId($turn->id->value, $barberId);
        }

        // Assign barber to this turn
        if ($turn->barberId === null) {
            $this->turnRepository->updateBarberId($turn->id->value, $barberId);
        }

        return true;
    }

    private function promoteNextEligibleInQueue(
        ScheduledQueue $scheduled,
        int $barberId
    ): void {
        $queue = $scheduled->queueOf($barberId);
        foreach ($queue as $turn) {
            $promoted = $this->promoteToInService($turn, $barberId);
            if ($promoted) {
                return;
            }
        }
    }

    private function buildTurnResponse(
        TurnEntity $turn,
        ScheduledQueue $scheduled,
    ): TurnDetailResponse {
        $turnId = $turn->id->value;
        return TurnDetailResponse::fromEntity(
            $turn,
            [
                'position' => $scheduled->findTurnPosition($turnId),
                'absolutePosition' => $scheduled->absolutePositionOf($turnId),
                'estimatedTime' => $scheduled->estimatedWaitMinutesFor($turnId),
            ]
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
    private function orchestrateTurnCreation(int $barbershopId, int $clientId, ?int $leaderBarberId, ?array $groupMembers): array
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
            $leaderBarberId,
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
            [$position, $barberId] = $freshScheduled->findTurnLocation($turnId);
            if ($position !== 1) {
                continue;
            }

            $turn = $this->turnRepository->getById($turnId);
            if ($turn !== null) {
                $this->promoteToInService($turn, $barberId);
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
            $groupId = $turn->groupId?->value;
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

        $scheduled = $this->scheduledQueue($turn->barbershopId->value);

        // Add all possible barber ids if owner barber is not specified
        if ($ownerBarberId === null) {
            foreach ($scheduled->slotsById as $barberId => $_) {
                $affectedBarberIds[] = $barberId;
            }
        }

        // Promote next turns for each affected barber
        foreach (array_unique($affectedBarberIds) as $barberId) {
            $this->promoteNextEligibleInQueue($scheduled, $barberId);
        }
    }

    public function deleteTurn(int $turnId): void
    {
        $turn = $this->validateTurnExists($turnId);

        if ($turn->attendedAt !== null) {
            throw new TurnException(
                'Cannot delete a turn that has been completed',
                HttpStatus::UnprocessableEntity
            );
        }

        $this->turnRepository->transaction(
            fn () => $this->orchestrateTurnDeletion($turn)
        );
    }

    public function waitTurn(int $turnId): TurnDetailResponse
    {
        $turn = $this->validateTurnExists($turnId);

        if ($turn->ownerStatus->value !== ClientStatusEnum::OnQueue->value) {
            throw new TurnException(
                'Only \'on_queue\' turns can be set to \'waiting\'',
                HttpStatus::UnprocessableEntity
            );
        }

        $this->setOwnerStatus($turn, ClientStatusEnum::Waiting->value);

        return $this->buildTurnResponse(
            turn: $this->turnRepository->getById($turnId),
            scheduled: $this->scheduledQueue($turn->barbershopId->value)
        );
    }

    private function orchestrateTurnUnwait(TurnEntity $turn): void
    {
        $this->setOwnerStatus($turn, ClientStatusEnum::OnQueue->value);

        $turnId = $turn->id->value;
        $scheduled = $this->scheduledQueue($turn->barbershopId->value);
        [$position, $barberId] = $scheduled->findTurnLocation($turnId);

        // Promote this turn if now is at position 1
        if ($position === 1) {
            $updatedTurn = $this->turnRepository->getById($turnId);
            $this->promoteToInService($updatedTurn, $barberId);
        }
    }

    public function unwaitTurn(int $turnId): TurnDetailResponse
    {
        $turn = $this->validateTurnExists($turnId);

        if ($turn->ownerStatus->value !== ClientStatusEnum::Waiting->value) {
            throw new TurnException(
                'Only \'waiting\' turns can be set back to \'on_queue\'',
                HttpStatus::UnprocessableEntity
            );
        }

        $this->turnRepository->transaction(
            fn () => $this->orchestrateTurnUnwait($turn)
        );

        return $this->buildTurnResponse(
            turn: $this->turnRepository->getById($turnId),
            scheduled: $this->scheduledQueue($turn->barbershopId->value)
        );
    }

    private function orchestrateTurnAttendance(TurnEntity $turn): void
    {
        $this->setOwnerStatus($turn, ClientStatusEnum::Attended->value);
        $this->turnRepository->setAttendedAt($turn->id->value);

        // Promote the next eligible turn
        $scheduled = $this->scheduledQueue($turn->barbershopId->value);
        $this->promoteNextEligibleInQueue(
            scheduled: $scheduled,
            barberId: $turn->barberId->value
        );
    }

    public function attendTurn(int $turnId): TurnDetailResponse
    {
        $turn = $this->validateTurnExists($turnId);

        if ($turn->ownerStatus->value !== ClientStatusEnum::InService->value) {
            throw new TurnException(
                'Only \'in_service\' turns can be attended',
                HttpStatus::UnprocessableEntity
            );
        }

        $this->turnRepository->transaction(
            fn () => $this->orchestrateTurnAttendance($turn)
        );

        return $this->buildTurnResponse(
            turn: $this->turnRepository->getById($turnId),
            scheduled: $this->scheduledQueue($turn->barbershopId->value)
        );
    }

    private function orchestrateTurnPayment(TurnEntity $turn, ?int $groupId): void
    {
        // Set client to paid
        $this->groupMemberRepository->updateClientStatus(
            $turn->ownerId->value,
            ClientStatusEnum::Paid->value
        );

        // Set solo client finished_at field
        if ($groupId === null) {
            $this->turnRepository->setFinishedAt($turn->id->value);
            return;
        }

        // Set all group members to paid
        $this->groupMemberRepository->updateAllMemberStatus($groupId, ClientStatusEnum::Paid->value);

        // Set whole group and leader finished_at field
        $this->turnRepository->setGroupFinishedAt($groupId);
    }

    public function payTurn(int $turnId): TurnDetailResponse
    {
        $turn = $this->validateTurnExists($turnId);

        if ($turn->ownerType->value === OwnerTypeEnum::Member->value) {
            throw new TurnException(
                'Member turns cannot be paid independently. The group leader must pay',
                HttpStatus::UnprocessableEntity
            );
        }

        if ($turn->ownerStatus->value !== ClientStatusEnum::Attended->value) {
            throw new TurnException(
                'Client must have status \'attended\' to pay',
                HttpStatus::UnprocessableEntity
            );
        }

        // Verify every member is attended
        $groupId = $turn->groupId?->value;
        if ($groupId !== null) {
            $memberTurns = $this->clientTurnRepository->getAllByGroupId($groupId);
            foreach ($memberTurns as $memberTurn) {
                if ($memberTurn->status->value !== ClientStatusEnum::Attended->value) {
                    throw new TurnException(
                        'All group members must have status \'attended\' before the group can pay',
                        HttpStatus::UnprocessableEntity
                    );
                }
            }
        }

        $this->turnRepository->transaction(
            fn () => $this->orchestrateTurnPayment($turn, $groupId)
        );

        return $this->buildTurnResponse(
            turn: $this->turnRepository->getById($turnId),
            scheduled: $this->scheduledQueue($turn->barbershopId->value)
        );
    }
}
