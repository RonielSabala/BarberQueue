<?php

declare(strict_types=1);

namespace App\DTOs\Employee\Responses;

use App\DTOs\BaseResponse;

readonly class EmployeeAssignmentResponse extends BaseResponse
{
    /** @param int[] $workingDays */
    public function __construct(
        public int $barbershopId,
        public string $startTime,
        public string $endTime,
        public array $workingDays,
    ) {}
}
