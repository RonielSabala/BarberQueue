<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Responses;

use App\DTOs\BaseResponse;

final readonly class CreateBarbershopResponse extends BaseResponse
{
    public function __construct(
        public int $id,
        public string $barbershopName,
        public string $email,
        public string $phone,
        public string $barbershopAddress,
        public string $photoUrl,
        public string $opensAt,
        public string $closesAt,
        public int $capacity,
        public bool $isActive
    ) {}
}
