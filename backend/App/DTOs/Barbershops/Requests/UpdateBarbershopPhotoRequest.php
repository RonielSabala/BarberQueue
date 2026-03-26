<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\Domain\ValueObjects\PhotoUrl;
use App\DTOs\BaseRequest;

readonly class UpdateBarbershopPhotoRequest extends BaseRequest
{
    public function __construct(
        public PhotoUrl $photoUrl,
    ) {}
}
