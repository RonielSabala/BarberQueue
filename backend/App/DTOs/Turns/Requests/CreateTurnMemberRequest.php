<?php

declare(strict_types=1);

namespace App\DTOs\Turns\Requests;

use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{Id, Username};

readonly class CreateTurnMemberRequest extends BaseRequest
{
    public function __construct(
        public ?Id $barberId,
        public Username $memberName,
    ) {}
}
