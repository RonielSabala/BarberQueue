<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\Domain\ValueObjects\{Email, Password};
use App\DTOs\BaseRequest;

readonly class LoginRequest extends BaseRequest
{
    public function __construct(
        public Email $email,
        public Password $password
    ) {}
}
