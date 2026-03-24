<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\DTOs\Barbershops\Requests\CreateBarbershopRequest;
use App\DTOs\Barbershops\Responses\{BarbershopResponse, CreateBarbershopResponse};
use App\Exceptions\BarbershopException;
use App\Repositories\BarbershopRepository;

class BarbershopService extends BaseService
{
    public function __construct(
        private readonly BarbershopRepository $barbershopRepository,
    ) {}

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
}
