<?php

declare(strict_types=1);

namespace App\DTOs\Auth\Responses;

use App\DTOs\BaseResponse;

final readonly class LoginResponse extends BaseResponse
{
    public function __construct(
        public readonly string $token,
        public readonly UserResponse $user,
    ) {}
}
