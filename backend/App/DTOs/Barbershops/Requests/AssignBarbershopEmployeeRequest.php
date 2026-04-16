<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\Attributes\ArrayOf;
use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{DayOfWeek, TimeOfDay};

final readonly class AssignBarbershopEmployeeRequest extends BaseRequest
{
    /** @param DayOfWeek[] $workingDays */
    public function __construct(
        public TimeOfDay $startTime,
        public TimeOfDay $endTime,
        #[ArrayOf(DayOfWeek::class, minItems: 1, maxItems: 7)]
        public array $workingDays,
    ) {}
}
