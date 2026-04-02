<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\{DateTimeString, Id, Rating, ReviewContent, Username};

readonly class BarbershopReviewEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Id $clientId,
        public Id $barbershopId,
        public Username $username,
        public Rating $rating,
        public ReviewContent $content,
        public DateTimeString $createdAt,
    ) {}
}
