<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Responses;

use App\DTOs\BaseResponse;

readonly class CreateBarbershopEmployeeResponse extends BaseResponse
{
    public function __construct(
        public int $id,
        public string $username,
        public string $email,
        public string $role,
    ) {}
}
