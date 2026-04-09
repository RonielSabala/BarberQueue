<?php

declare(strict_types=1);

namespace App\Services\Barber;

use App\Core\HttpStatus;
use App\Domain\Entities\Barber\BarberEntity;
use App\DTOs\Barbers\Requests\UpdateBarberStatusRequest;
use App\Exceptions\Barber\BarberException;
use App\Domain\Enums\{BarberStatusEnum, RoleEnum};
use App\DTOs\Barbers\Responses\{BarberDashboardResponse, BarberResponse};
use App\Repositories\{Barber\BarberRepository, Turn\QueueRepository, UserRepository};
use App\Services\{Turn\TurnService, BaseService};

final readonly class BarberService extends BaseService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly BarberRepository $barberRepository,
        private readonly QueueRepository $queueRepository,
        private readonly TurnService $turnService,
    ) {}

    public function validateBarberExists(int $barberId): BarberEntity
    {
        $barber = $this->barberRepository->getById($barberId);
        if ($barber === null) {
            throw new BarberException('Barber not found', HttpStatus::NotFound);
        }

        return $barber;
    }

    public function validateBarberUserExists(int $barberId): void
    {
        $barber = $this->userRepository->getById($barberId);
        if ($barber === null) {
            throw new BarberException('Barber not found', HttpStatus::NotFound);
        }

        if ($barber->role->value !== RoleEnum::Barber->value) {
            throw new BarberException('This user is not a barber', HttpStatus::NotFound);
        }
    }

    public function get(int $barberId): BarberResponse
    {
        $barber = $this->validateBarberExists($barberId);
        return BarberResponse::fromEntity($barber);
    }

    public function getDashboard(int $barberId): BarberDashboardResponse
    {
        $this->validateBarberUserExists($barberId);

        $dashboard = $this->barberRepository->getDashboard($barberId);
        if ($dashboard === null) {
            throw new \RuntimeException('Failed to generate barber dashboard');
        }

        return BarberDashboardResponse::fromEntity($dashboard);
    }

    public function updateStatus(int $barberId, UpdateBarberStatusRequest $request): void
    {
        $barber = $this->validateBarberExists($barberId);
        $fields = $this->validateFieldsToUpdate($request);

        $willBeActive = (
            (
                $fields['current_status'] ?? $barber->currentStatus->value
            ) === BarberStatusEnum::Active->value
        );

        if (!$willBeActive && $this->queueRepository->barberHasActiveTurns($barberId)) {
            throw new BarberException(
                'Cannot change status while there are active turns in your queue.',
                HttpStatus::UnprocessableEntity
            );
        }

        $this->barberRepository->updateStatus($barberId, $fields);

        $wasAccepting = $barber->isAccepting;
        $wasActive = $barber->currentStatus->value === BarberStatusEnum::Active->value;
        $willAccept = ($fields['is_accepting'] ?? $barber->isAccepting) === 1;
        $shouldPromoteToInService = (
            $willBeActive
            && (
                ($willAccept && !$wasAccepting)
                || ($wasAccepting && !$wasActive)
            )
        );

        if (!$shouldPromoteToInService) {
            return;
        }

        $barbershopId = $this->queueRepository->findActiveBarbershopForBarber($barberId);
        if ($barbershopId === null) {
            return;
        }

        $scheduled = $this->turnService->scheduledQueue($barbershopId);
        $queue = $scheduled->queueOf($barberId);
        if (empty($queue)) {
            return;
        }

        $this->turnService->promoteToInService($queue[0], $barberId);
    }
}
