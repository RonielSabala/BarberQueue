<?php

declare(strict_types=1);

namespace App\Domain\Entities\Barber;

use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{
    DateTimeString,
    Id,
    PhotoUrl,
    Rating,
    ReviewContent,
    Username
};

final readonly class BarberReviewEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Id $clientId,
        public Username $username,
        public ?PhotoUrl $photoUrl,
        public Rating $rating,
        public ReviewContent $content,
        public DateTimeString $createdAt,
    ) {}
}
