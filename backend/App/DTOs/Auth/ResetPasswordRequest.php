<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\Domain\ValueObjects\{Password, ResetCode};

readonly class ResetPasswordRequest
{
    public function __construct(
        public ResetCode $resetCode,
        public Password $password
    ) {}
}
