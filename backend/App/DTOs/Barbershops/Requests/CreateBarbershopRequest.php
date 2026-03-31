<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\Domain\ValueObjects\{
    Address,
    BarbershopName,
    Capacity,
    Email,
    Id,
    Phone,
    PhotoUrl,
    TimeOfDay
};
use App\DTOs\BaseRequest;

readonly class CreateBarbershopRequest extends BaseRequest
{
    public function __construct(
        public Id $adminId,
        public BarbershopName $barbershopName,
        public Email $email,
        public Phone $phone,
        public Address $barbershopAddress,
        public PhotoUrl $photoUrl,
        public TimeOfDay $opensAt,
        public TimeOfDay $closesAt,
        public ?Capacity $capacity
    ) {}
}
