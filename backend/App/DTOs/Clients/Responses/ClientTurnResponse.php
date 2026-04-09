<?php

declare(strict_types=1);

namespace App\DTOs\Clients\Responses;

use App\DTOs\BaseResponse;

final readonly class ClientTurnResponse extends BaseResponse
{
    public function __construct(
        public int $id,
        public int $barbershopId,
        public int $clientId,
        public ?int $barberId,
        public string $username,
        public string $status,
        public ?int $position,
        public ?int $absolutePosition,
        public ?float $estimatedTime,
        public ?float $estimatedGroupTime,
        public string $createdAt,
        public ?GroupResponse $group,
    ) {}
}
