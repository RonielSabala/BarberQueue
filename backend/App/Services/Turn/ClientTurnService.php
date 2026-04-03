<?php

declare(strict_types=1);

namespace App\Services\Turn;

use App\Core\HttpStatus;
use App\Domain\Enums\ClientStatusEnum;
use App\Exceptions\Turn\ClientTurnException;
use App\Services\Barbershop\BarbershopClientService;
use App\DTOs\Clients\Responses\{
    ClientTurnResponse,
    GroupMemberTurnResponse,
    GroupResponse
};
use App\Repositories\Turn\{ClientTurnRepository, TurnRepository};

class ClientTurnService extends TurnService
{
    public function __construct(
        private readonly TurnRepository $turnRepository,
        private readonly ClientTurnRepository $clientTurnRepository,
        private readonly BarbershopClientService $barbershopClientService,
    ) {}

    public function getTurn(int $clientId): ClientTurnResponse
    {
        $client = $this->barbershopClientService->validateBarbershopClientExists($clientId);
        $this->barbershopClientService->validateClientIsInBarbershop($client->barbershopId);

        if ($client->currentStatus->value === ClientStatusEnum::AtBarbershop->value) {
            throw new ClientTurnException(
                'The client currently has no turn despite being in a barbershop',
                HttpStatus::NotFound
            );
        }

        $turn = $this->clientTurnRepository->getById($clientId);
        if ($turn === null) {
            throw new ClientTurnException('No active turn found for this client', HttpStatus::NotFound);
        }

        $group = null;
        if ($turn->groupId !== null) {
            $memberTurns = $this->clientTurnRepository->getAllByGroupId($turn->groupId->value);
            $group = new GroupResponse(
                groupId: $turn->groupId->value,
                members: GroupMemberTurnResponse::fromEntities($memberTurns),
            );
        }

        $turnId = $turn->id->value;
        $turnBarbershopId = $turn->barbershopId->value;
        $scheduled = $this->getScheduledQueue($this->turnRepository, $turnBarbershopId);

        return new ClientTurnResponse(
            id: $turnId,
            barbershopId: $turnBarbershopId,
            clientId: $turn->clientId->value,
            barberId: $turn->barberId?->value,
            username: $turn->username->value,
            status: $turn->status->value,
            position: $scheduled->findTurnPosition($turnId) ?? 0,
            createdAt: $turn->createdAt->value,
            group: $group,
        );
    }
}
