<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\Domain\ValueObjects\{Email, Password};

readonly class LoginRequest
{
    public function __construct(
        public Email $email,
        public Password $password
    ) {}
}
