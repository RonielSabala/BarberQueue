<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Attributes\ArrayOf;
use App\Domain\ValueObjects\{DayOfWeek, Id, TimeOfDay};

final readonly class EmployeeAssignmentEntity extends BaseEntity
{
    public function __construct(
        public Id $barbershopId,
        public TimeOfDay $startTime,
        public TimeOfDay $endTime,
        #[ArrayOf(DayOfWeek::class, minItems: 1, maxItems: 7)]
        public array $workingDays,
    ) {}
}
