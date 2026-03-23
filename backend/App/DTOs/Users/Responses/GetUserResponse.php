<?php

declare(strict_types=1);

namespace App\DTOs\Users\Responses;

use App\DTOs\BaseResponse;

readonly class GetUserResponse extends BaseResponse
{
    public function __construct(
        public readonly int $id,
        public readonly string $username,
        public readonly string $email,
        public readonly string $phone,
        public readonly string $role,
    ) {}
}
