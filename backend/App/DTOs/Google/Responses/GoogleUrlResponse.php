<?php

declare(strict_types=1);

namespace App\DTOs\Google\Responses;

use App\DTOs\BaseResponse;

final readonly class GoogleUrlResponse extends BaseResponse
{
    public function __construct(
        public string $url
    ) {}
}
