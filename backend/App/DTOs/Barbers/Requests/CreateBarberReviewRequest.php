<?php

declare(strict_types=1);

namespace App\DTOs\Barbers\Requests;

use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{Id, Rating, ReviewContent};

final readonly class CreateBarberReviewRequest extends BaseRequest
{
    public function __construct(
        public Id $clientId,
        public Rating $rating,
        public ReviewContent $content,
    ) {}
}
