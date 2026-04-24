<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\Attributes\ArrayOf;
use App\DTOs\BaseRequest;

final readonly class CreateBarbershopPhotosRequest extends BaseRequest
{
    /** @param CreateBarbershopPhotoRequest[] $photos */
    public function __construct(
        #[ArrayOf(CreateBarbershopPhotoRequest::class, minItems: 1)]
        public array $photos
    ) {}
}
