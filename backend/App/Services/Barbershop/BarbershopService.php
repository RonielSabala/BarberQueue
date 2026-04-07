<?php

declare(strict_types=1);

namespace App\Services\Barbershop;

use App\Core\HttpStatus;
use App\Domain\Entities\Barbershop\BarbershopEntity;
use App\Domain\Enums\RoleEnum;
use App\DTOs\Barbershops\Requests\CreateBarbershopRequest;
use App\DTOs\BaseRequest;
use App\Exceptions\Barbershop\BarbershopException;
use App\Repositories\Barbershop\BarbershopRepository;
use App\DTOs\Barbershops\Responses\{
    BarbershopDashboardResponse,
    BarbershopDetailResponse,
    BarbershopResponse,
    CreateBarbershopResponse
};
use App\Services\{BaseService, UserService};

final readonly class BarbershopService extends BaseService
{
    public function __construct(
        private readonly BarbershopRepository $barbershopRepository,
        private readonly UserService $userService,
    ) {}

    public function validateBarbershopExists(int $barbershopId): BarbershopEntity
    {
        $barbershop = $this->barbershopRepository->getById($barbershopId);
        if ($barbershop === null) {
            throw new BarbershopException('Barbershop not found', HttpStatus::NotFound);
        }

        return $barbershop;
    }

    /** @return BarbershopResponse[] */
    public function getAll(?string $search, ?bool $isOpen, ?int $adminId): array
    {
        $barbershops = $this->barbershopRepository->getAll($search, $isOpen, $adminId);
        return BarbershopResponse::fromEntities($barbershops);
    }

    public function create(CreateBarbershopRequest $request): CreateBarbershopResponse
    {
        // Validate admin
        $adminId = $request->adminId->value;
        $admin = $this->userService->validateUserExists($adminId);
        if ($admin->role->value !== RoleEnum::Admin->value) {
            throw new BarbershopException(
                'Only admins can own barbershops',
                HttpStatus::Forbidden
            );
        }

        $email = $request->email->value;
        $existing = $this->barbershopRepository->getByEmail($email);

        if ($existing !== null) {
            throw new BarbershopException('Barbershop email already in use', HttpStatus::Conflict);
        }

        $barbershop = $this->barbershopRepository->createBarbershop(
            adminId: $request->adminId->value,
            barbershopName: $request->barbershopName->value,
            email: $email,
            phone: $request->phone->value,
            barbershopAddress: $request->barbershopAddress->value,
            photoUrl: $request->photoUrl->value,
            opensAt: $request->opensAt->value,
            closesAt: $request->closesAt->value,
            capacity: $request->capacity?->value ?? 1
        );

        if ($barbershop === null) {
            throw new \RuntimeException('Failed to save barbershop');
        }

        return CreateBarbershopResponse::fromEntity($barbershop);
    }

    public function get(int $barbershopId): BarbershopDetailResponse
    {
        $barbershop = $this->validateBarbershopExists($barbershopId);
        return BarbershopDetailResponse::fromEntity($barbershop);
    }

    public function getDashboard(int $barbershopId): BarbershopDashboardResponse
    {
        $this->validateBarbershopExists($barbershopId);
        $dashboard = $this->barbershopRepository->getDashboard($barbershopId);
        return BarbershopDashboardResponse::fromEntity($dashboard);
    }

    public function update(int $barbershopId, BaseRequest $request): void
    {
        $this->validateBarbershopExists($barbershopId);
        $fields = $this->validateFieldsToUpdate($request);
        $this->barbershopRepository->update($barbershopId, $fields);
    }
}
