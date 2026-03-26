<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Responses;

use App\DTOs\BaseResponse;

readonly class GetBarbershopPhotosResponse extends BaseResponse
{
    /** @param BarbershopPhotoResponse[] $photos */
    public function __construct(
        public array $photos
    ) {}
}
