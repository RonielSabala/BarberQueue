<?php

declare(strict_types=1);

namespace App\DTOs\Barbers\Responses;

use App\DTOs\BaseResponse;

readonly class BarberReviewResponse extends BaseResponse
{
    public function __construct(
        public int $id,
        public int $clientId,
        public string $username,
        public int $rating,
        public string $content,
        public string $createdAt,
    ) {}
}
