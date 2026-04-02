<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Enums\RoleEnum;
use App\DTOs\Barbers\Requests\UpdateBarberStatusRequest;
use App\Exceptions\BarberException;
use App\DTOs\Barbers\Responses\{BarberDashboardResponse, BarberResponse};
use App\Repositories\{BarberRepository, UserRepository};

class BarberService extends BaseService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly BarberRepository $barberRepository,
    ) {}

    public function validateBarber(int $barberId): void
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
        $barber = $this->barberRepository->getById($barberId);
        if ($barber === null) {
            throw new BarberException('Barber not found', HttpStatus::NotFound);
        }

        return BarberResponse::fromEntity($barber);
    }

    public function getDashboard(int $barberId): BarberDashboardResponse
    {
        $this->validateBarber($barberId);

        $dashboard = $this->barberRepository->getDashboard($barberId);
        if ($dashboard === null) {
            throw new \RuntimeException('Failed to generate barber dashboard');
        }

        return BarberDashboardResponse::fromEntity($dashboard);
    }

    public function updateStatus(int $barberId, UpdateBarberStatusRequest $request): void
    {
        $this->validateBarber($barberId);
        $fields = $this->validateFieldsToUpdate($request);
        $this->barberRepository->updateStatus($barberId, $fields);
    }
}
