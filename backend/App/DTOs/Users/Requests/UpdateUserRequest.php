<?php

declare(strict_types=1);

namespace App\DTOs\Users\Requests;

use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{Email, Phone, Username};

readonly class UpdateUserRequest extends BaseRequest
{
    public function __construct(
        public readonly ?Username $username,
        public readonly ?Email $email,
        public readonly ?Phone $phone
    ) {}
}
