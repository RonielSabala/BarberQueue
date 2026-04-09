<?php

declare(strict_types=1);

namespace App\DTOs\Clients\Responses;

use App\DTOs\BaseResponse;

final readonly class GroupResponse extends BaseResponse
{
    /** @param GroupMemberTurnResponse[] $members */
    public function __construct(
        public int $groupId,
        public array $members,
    ) {}
}
