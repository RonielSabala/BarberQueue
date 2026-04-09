<?php

declare(strict_types=1);

namespace App\DTOs\GroupMembers\Responses;

use App\DTOs\BaseResponse;

final readonly class GroupMemberTurnResponse extends BaseResponse
{
    public function __construct(
        public int $id,
        public int $barbershopId,
        public int $memberId,
        public ?int $barberId,
        public int $groupId,
        public string $memberName,
        public string $status,
        public ?int $position,
        public string $createdAt,
    ) {}
}
