<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Responses;

use App\DTOs\BaseResponse;

final readonly class BarbershopClientResponse extends BaseResponse
{
    public function __construct(
        public int $clientId,
        public string $currentStatus,
        public string $username,
    ) {}
}
