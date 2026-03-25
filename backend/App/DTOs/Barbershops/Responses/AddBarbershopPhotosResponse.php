<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Responses;

use App\DTOs\BaseResponse;

readonly class AddBarbershopPhotosResponse extends BaseResponse
{
    /** @param BarbershopPhotoResponse[] $uploaded */
    public function __construct(
        public array $uploaded
    ) {}
}
