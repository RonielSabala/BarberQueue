<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\Barbershop;
use App\DTOs\Barbershops\Requests\CreateBarbershopRequest;
use App\DTOs\Barbershops\Responses\{
    BarbershopDetailResponse,
    BarbershopResponse,
    CreateBarbershopResponse
};
use App\DTOs\BaseRequest;
use App\Exceptions\BarbershopException;
use App\Repositories\BarbershopRepository;

class BarbershopService extends BaseService
{
    public function __construct(
        private readonly BarbershopRepository $barbershopRepository,
    ) {}

    private function validateBarbershopExists(int $barbershopId): Barbershop
    {
        $barbershop = $this->barbershopRepository->findById($barbershopId);
        if ($barbershop === null) {
            throw new BarbershopException('Barbershop not found', HttpStatus::NotFound);
        }

        return $barbershop;
    }

    public function getAll(?string $search, ?bool $isOpen): array
    {
        $barbershops = $this->barbershopRepository->findAll($search, $isOpen);
        return array_map(
            static fn ($barbershop) => BarbershopResponse::fromEntity($barbershop),
            $barbershops
        );
    }

    public function create(CreateBarbershopRequest $request): CreateBarbershopResponse
    {
        $email = $request->email->value;
        $existing = $this->barbershopRepository->findByEmail($email);

        if ($existing !== null) {
            throw new BarbershopException('Email already in use', HttpStatus::Conflict);
        }

        $barbershop = $this->barbershopRepository->create(
            $request->barbershopName,
            $request->email,
            $request->phone,
            $request->barbershopAddress,
            $request->photoUrl,
            $request->opensAt,
            $request->closesAt,
            $request->capacity
        );

        return CreateBarbershopResponse::fromEntity($barbershop);
    }

    public function getBarbershop(int $barbershopId): BarbershopDetailResponse
    {
        $barbershop = $this->validateBarbershopExists($barbershopId);
        return BarbershopDetailResponse::fromEntity($barbershop);
    }

    public function updateBarbershopFields(int $barbershopId, BaseRequest $request): void
    {
        $this->validateBarbershopExists($barbershopId);
        $fields = $this->validateFieldsToUpdate($request);
        $this->barbershopRepository->updateFields($barbershopId, $fields);
    }
}
