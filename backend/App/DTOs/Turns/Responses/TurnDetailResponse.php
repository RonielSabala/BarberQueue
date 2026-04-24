<?php

declare(strict_types=1);

namespace App\DTOs\Turns\Responses;

use App\DTOs\BaseResponse;

readonly class TurnDetailResponse extends BaseResponse
{
    public function __construct(
        public int $id,
        public int $ownerId,
        public int $barbershopId,
        public ?int $groupId,
        public ?int $barberId,
        public string $ownerName,
        public string $ownerType,
        public string $ownerStatus,
        public ?int $position,
        public ?int $absolutePosition,
        public ?float $estimatedTime,
        public ?int $groupSize,
        public string $createdAt,
        public ?string $attendedAt,
        public ?string $finishedAt,
    ) {}
}
