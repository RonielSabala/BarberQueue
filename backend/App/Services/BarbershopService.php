<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Barbershops\Responses\BarbershopResponse;
use App\Repositories\BarbershopRepository;

class BarbershopService extends BaseService
{
    public function __construct(
        private readonly BarbershopRepository $barbershopRepository,
    ) {}

    public function getAll(?string $search, ?bool $isOpen): array
    {
        $entities = $this->barbershopRepository->findAll($search, $isOpen);
        return array_map(
            static fn ($entity) => BarbershopResponse::fromEntity($entity),
            $entities
        );
    }
}
