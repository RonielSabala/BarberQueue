<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\DTOs\BaseResponse;

readonly class UserResponse extends BaseResponse
{
    public function __construct(
        public readonly int $id,
        public readonly string $username,
        public readonly string $email,
        public readonly string $role,
    ) {}
}
