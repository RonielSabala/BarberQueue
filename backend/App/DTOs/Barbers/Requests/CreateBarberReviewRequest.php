<?php

declare(strict_types=1);

namespace App\DTOs\Barbers\Requests;

use App\Domain\ValueObjects\{Id, Rating, ReviewContent};
use App\DTOs\BaseRequest;

readonly class CreateBarberReviewRequest extends BaseRequest
{
    public function __construct(
        public Id $clientId,
        public Rating $rating,
        public ReviewContent $content,
    ) {}
}
