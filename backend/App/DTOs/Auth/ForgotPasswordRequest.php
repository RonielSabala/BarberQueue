<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\Domain\ValueObjects\Email;
use App\DTOs\BaseRequest;

readonly class ForgotPasswordRequest extends BaseRequest
{
    public function __construct(
        public Email $email
    ) {}
}
