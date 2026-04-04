<?php

declare(strict_types=1);

namespace App\DTOs\Turns\Requests;

use App\Attributes\ArrayOf;
use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{Id, Username};

readonly class CreateTurnRequest extends BaseRequest
{
    /** @param null|Username[] $groupMembers */
    public function __construct(
        public Id $clientId,
        public Id $barbershopId,
        public ?Id $barberId = null,
        #[ArrayOf(Username::class, minItems: 1, maxItems: 10)]
        public ?array $groupMembers = null,
    ) {}
}
