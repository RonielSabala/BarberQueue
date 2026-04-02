<?php

declare(strict_types=1);

namespace App\DTOs\Auth\Requests;

use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{Password, ResetCode};

readonly class ResetPasswordRequest extends BaseRequest
{
    public function __construct(
        public ResetCode $resetCode,
        public Password $newPassword
    ) {}
}
