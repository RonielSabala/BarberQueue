<?php

declare(strict_types=1);

namespace App\DTOs\Turns\Requests;

use App\Attributes\ArrayOf;
use App\Domain\ValueObjects\Id;
use App\DTOs\BaseRequest;

readonly class CreateTurnRequest extends BaseRequest
{
    /** @param null|CreateTurnMemberRequest[] $groupMembers */
    public function __construct(
        public Id $clientId,
        public Id $barbershopId,
        public ?Id $barberId,
        #[ArrayOf(CreateTurnMemberRequest::class, minItems: 1, maxItems: 10)]
        public ?array $groupMembers,
    ) {}
}
