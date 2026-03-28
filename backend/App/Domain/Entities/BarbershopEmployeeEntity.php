<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Attributes\ArrayOf;
use App\Domain\ValueObjects\{DayOfWeek, Email, Id, Phone, RoleName, TimeOfDay, Username};

readonly class BarbershopEmployeeEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Id $barbershopId,
        public Username $username,
        public Email $email,
        public Phone $phone,
        public RoleName $role,
        public TimeOfDay $startTime,
        public TimeOfDay $endTime,
        #[ArrayOf(DayOfWeek::class, minItems: 1, maxItems: 7)]
        public array $workingDays,
    ) {}
}
