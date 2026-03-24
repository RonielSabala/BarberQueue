<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\{Address, AverageRating, BarbershopName, Capacity, Email, Id, Phone, PhotoUrl, TimeOfDay};

readonly class Barbershop extends BaseEntity
{
    public bool $isOpen;

    public function __construct(
        public Id $id,
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
        $this->isOpen = ($now >= $this->opensAt->value && $now <= $this->closesAt->value);
    }
}
