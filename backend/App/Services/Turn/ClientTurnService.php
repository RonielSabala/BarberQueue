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

class ClientTurnService extends BaseTurnService
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

        $scheduled = $this->getScheduledQueue(
            $this->turnRepository,
            $turn->barbershopId->value
        );

        $group = null;
        $groupId = $turn->groupId;
        if ($groupId !== null) {
            $memberTurns = $this->clientTurnRepository->getAllByGroupId($groupId->value);
            $memberResponses = array_map(
                static fn ($turn) => GroupMemberTurnResponse::fromEntity(
                    $turn,
                    ['position' => $scheduled->findTurnPosition($turn->id->value)]
                ),
                $memberTurns
            );

            $group = new GroupResponse(groupId: $groupId->value, members: $memberResponses);
        }

        return ClientTurnResponse::fromEntity(
            $turn,
            [
                'position' => $scheduled->findTurnPosition($turn->id->value),
                'group' => $group,
            ]
        );
    }
}
