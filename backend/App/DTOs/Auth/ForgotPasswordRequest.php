<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\Domain\ValueObjects\Email;

readonly class ForgotPasswordRequest
{
    public function __construct(
        public Email $email
    ) {}
}
