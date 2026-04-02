<?php

declare(strict_types=1);

namespace App\DTOs\Auth\Requests;

use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{Email, Password};

final readonly class LoginRequest extends BaseRequest
{
    public function __construct(
        public Email $email,
        public Password $password
    ) {}
}
