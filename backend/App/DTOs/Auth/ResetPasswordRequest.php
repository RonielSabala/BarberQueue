<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\Domain\ValueObjects\{Password, Token};

readonly class ResetPasswordRequest
{
    public function __construct(
        public Token $resetToken,
        public Password $password
    ) {}
}
