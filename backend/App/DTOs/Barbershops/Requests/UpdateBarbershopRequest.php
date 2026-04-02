<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{
    Address,
    BarbershopName,
    Capacity,
    Email,
    Phone,
    TimeOfDay
};

readonly class UpdateBarbershopRequest extends BaseRequest
{
    public function __construct(
        public ?BarbershopName $barbershopName,
        public ?Email $email,
        public ?Phone $phone,
        public ?Address $barbershopAddress,
        public ?TimeOfDay $opensAt,
        public ?TimeOfDay $closesAt,
        public ?Capacity $capacity
    ) {}
}
