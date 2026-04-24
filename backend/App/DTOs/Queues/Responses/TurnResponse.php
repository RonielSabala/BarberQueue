<?php

declare(strict_types=1);

namespace App\DTOs\Queues\Responses;

use App\DTOs\BaseResponse;

final readonly class TurnResponse extends BaseResponse
{
    public function __construct(
        public int $id,
        public int $ownerId,
        public ?int $groupId,
        public ?int $barberId,
        public string $ownerName,
        public string $ownerType,
        public string $ownerStatus,
        public ?string $ownerPhotoUrl,
        public ?int $position,
        public ?int $absolutePosition,
        public ?float $estimatedTime,
        public ?int $groupSize
    ) {}
}
