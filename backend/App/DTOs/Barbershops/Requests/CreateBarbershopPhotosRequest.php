<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\Attributes\ArrayOf;
use App\Domain\ValueObjects\PhotoUrl;
use App\DTOs\BaseRequest;

readonly class CreateBarbershopPhotosRequest extends BaseRequest
{
    public function __construct(
        #[ArrayOf(PhotoUrl::class, minItems: 1)]
        public array $photoUrls
    ) {}
}
