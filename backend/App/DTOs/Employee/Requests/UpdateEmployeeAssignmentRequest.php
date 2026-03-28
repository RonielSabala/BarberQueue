<?php

declare(strict_types=1);

namespace App\DTOs\Employee\Requests;

use App\Attributes\ArrayOf;
use App\Domain\ValueObjects\{DayOfWeek, TimeOfDay};
use App\DTOs\BaseRequest;

readonly class UpdateEmployeeAssignmentRequest extends BaseRequest
{
    public function __construct(
        public ?TimeOfDay $startTime,
        public ?TimeOfDay $endTime,
        #[ArrayOf(DayOfWeek::class, minItems: 1, maxItems: 7)]
        public ?array $workingDays
    ) {}
}
