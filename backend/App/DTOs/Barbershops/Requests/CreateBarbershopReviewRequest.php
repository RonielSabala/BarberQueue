<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{Id, Rating, ReviewContent};

readonly class CreateBarbershopReviewRequest extends BaseRequest
{
    public function __construct(
        public Id $clientId,
        public Rating $rating,
        public ReviewContent $content
    ) {}
}
