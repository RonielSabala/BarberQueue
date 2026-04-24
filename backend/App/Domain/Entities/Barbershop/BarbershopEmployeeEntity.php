<?php

declare(strict_types=1);

namespace App\Domain\Entities\Barbershop;

use App\Attributes\ArrayOf;
use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{
    DayOfWeek,
    Email,
    Id,
    Phone,
    PhotoUrl,
    Role,
    TimeOfDay,
    Username
};

final readonly class BarbershopEmployeeEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Id $barbershopId,
        public Username $username,
        public Email $email,
        public Phone $phone,
        public ?PhotoUrl $photoUrl,
        public Role $role,
        public TimeOfDay $startTime,
        public TimeOfDay $endTime,
        #[ArrayOf(DayOfWeek::class, minItems: 1, maxItems: 7)]
        public array $workingDays,
    ) {}
}
