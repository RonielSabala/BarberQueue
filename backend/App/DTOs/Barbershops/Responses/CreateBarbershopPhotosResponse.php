<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Responses;

use App\DTOs\BaseResponse;

readonly class CreateBarbershopPhotosResponse extends BaseResponse
{
    /** @param BarbershopPhotoResponse[] $uploaded */
    public function __construct(
        public array $uploaded
    ) {}
}
