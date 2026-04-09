<?php

declare(strict_types=1);

namespace App\DTOs\Clients\Responses;

use App\DTOs\BaseResponse;

final readonly class GroupMemberTurnResponse extends BaseResponse
{
    public function __construct(
        public int $id,
        public int $memberId,
        public string $memberName,
        public ?int $barberId,
        public ?int $position,
        public ?int $absolutePosition,
        public ?float $estimatedTime,
        public string $status,
    ) {}
}
