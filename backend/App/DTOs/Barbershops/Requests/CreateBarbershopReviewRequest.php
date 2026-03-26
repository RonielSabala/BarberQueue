<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\Domain\ValueObjects\{Id, Rating, ReviewContent};
use App\DTOs\BaseRequest;

readonly class CreateBarbershopReviewRequest extends BaseRequest
{
    public function __construct(
        public Id $userId,
        public Rating $rating,
        public ReviewContent $content
    ) {}
}
