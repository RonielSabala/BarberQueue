<?php

declare(strict_types=1);

namespace App\DTOs\Barbers\Responses;

use App\DTOs\BaseResponse;

final readonly class BarberResponse extends BaseResponse
{
    public function __construct(
        public int $id,
        public string $username,
        public string $currentStatus,
        public bool $isAccepting,
    ) {}
}
