<?php

declare(strict_types=1);

namespace App\Domain\Entities\Barbershop;

use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{
    Address,
    AverageRating,
    BarbershopName,
    Capacity,
    Email,
    Id,
    Phone,
    PhotoUrl,
    TimeOfDay
};

final readonly class BarbershopEntity extends BaseEntity
{
    public bool $isOpen;

    public function __construct(
        public Id $id,
        public Id $adminId,
        public BarbershopName $barbershopName,
        public Email $email,
        public Phone $phone,
        public Address $barbershopAddress,
        public PhotoUrl $photoUrl,
        public TimeOfDay $opensAt,
        public TimeOfDay $closesAt,
        public Capacity $capacity,
        public bool $isActive,
        public ?AverageRating $averageRating,
    ) {
        $now = date('H:i:s');
        $opensAt = $this->opensAt->value;
        $closesAt = $this->closesAt->value;

        $this->isOpen = (
            $now >= $opensAt
            && $now <= $closesAt
            || $opensAt === $closesAt
        );
    }
}
