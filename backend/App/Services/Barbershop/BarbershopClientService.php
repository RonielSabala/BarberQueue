<?php

declare(strict_types=1);

namespace App\Services\Barbershop;

use App\Core\HttpStatus;
use App\Domain\Entities\Barbershop\BarbershopClientEntity;
use App\Domain\ValueObjects\Id;
use App\DTOs\Barbershops\Responses\BarbershopClientResponse;
use App\Exceptions\Barbershop\BarbershopClientException;
use App\Repositories\Barbershop\BarbershopClientRepository;
use App\Domain\Enums\{ClientStatusEnum, RoleEnum};
use App\Services\{BaseService, UserService};

final readonly class BarbershopClientService extends BaseService
{
    public function __construct(
        private readonly BarbershopClientRepository $barbershopClientRepository,
        private readonly UserService $userService,
        private readonly BarbershopService $BarbershopService,
    ) {}

    public function validateBarbershopClientExists(int $clientId): BarbershopClientEntity
    {
        $client = $this->barbershopClientRepository->getByClientId($clientId);
        if ($client === null) {
            throw new BarbershopClientException('Client not found in barbershop', HttpStatus::NotFound);
        }

        return $client;
    }

    public function validateClientIsInBarbershop(?Id $clientBarbershopId): void
    {
        if ($clientBarbershopId === null) {
            throw new BarbershopClientException(
                'The client is not currently checked into any barbershop',
                HttpStatus::BadRequest
            );
        }
    }

    public function validateClientIsAt(?Id $clientBarbershopId, int $barbershopId): void
    {
        if ($clientBarbershopId?->value !== $barbershopId) {
            throw new BarbershopClientException(
                'The client is registered at a different barbershop location',
                HttpStatus::Conflict
            );
        }
    }

    /** @return BarbershopClientResponse[] */
    public function getAllAtBarbershop(int $barbershopId): array
    {
        $this->BarbershopService->validateBarbershopExists($barbershopId);

        $statuses = $this->barbershopClientRepository->getAllAtBarbershop($barbershopId);
        return BarbershopClientResponse::fromEntities($statuses);
    }

    public function checkIn(int $barbershopId, int $clientId): void
    {
        $barbershop = $this->BarbershopService->validateBarbershopExists($barbershopId);
        if (!$barbershop->isOpen) {
            throw new BarbershopClientException(
                'Barbershop is not open',
                HttpStatus::BadRequest
            );
        }

        $client = $this->userService->validateUserExists($clientId);
        if ($client->role->value !== RoleEnum::Client->value) {
            throw new BarbershopClientException('Only clients can check in to a barbershop', HttpStatus::Forbidden);
        }

        $barbershopClient = $this->validateBarbershopClientExists($clientId);
        if ($barbershopClient->currentStatus->value !== ClientStatusEnum::Default->value) {
            throw new BarbershopClientException(
                'Client is already active in a barbershop',
                HttpStatus::Conflict
            );
        }

        if ($this->barbershopClientRepository->isBarbershopFull($barbershopId)) {
            throw new BarbershopClientException(
                'Barbershop is full',
                HttpStatus::UnprocessableEntity
            );
        }

        $this->barbershopClientRepository->updateBarbershopStatus(
            clientId: $clientId,
            barbershopId: $barbershopId,
            currentStatus: ClientStatusEnum::AtBarbershop->value
        );
    }

    public function checkOut(int $barbershopId, int $clientId): void
    {
        $this->BarbershopService->validateBarbershopExists($barbershopId);
        $client = $this->validateBarbershopClientExists($clientId);

        $clientBarbershopId = $client->barbershopId;
        $this->validateClientIsInBarbershop($clientBarbershopId);

        $clientStatus = $client->currentStatus->value;
        if (
            $clientStatus !== ClientStatusEnum::AtBarbershop->value
            && $clientStatus !== ClientStatusEnum::Paid->value
        ) {
            throw new BarbershopClientException(
                'Client must have status \'at_barbershop\' or \'paid\' to check out',
                HttpStatus::Forbidden
            );
        }

        $this->validateClientIsAt($clientBarbershopId, $barbershopId);

        $this->barbershopClientRepository->updateBarbershopStatus(
            clientId: $clientId,
            barbershopId: null,
            currentStatus: ClientStatusEnum::Default->value
        );
    }
}
