<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{Description, PhotoUrl};

final readonly class CreateBarbershopPhotoRequest extends BaseRequest
{
    public function __construct(
        public PhotoUrl $photoUrl,
        public Description $photoDescription
    ) {}
}
