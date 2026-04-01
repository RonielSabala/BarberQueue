<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\Attributes\ArrayOf;
use App\Domain\ValueObjects\{DayOfWeek, Email, Password, Phone, Role, TimeOfDay, Username};
use App\DTOs\BaseRequest;

readonly class CreateBarbershopEmployeeRequest extends BaseRequest
{
    public function __construct(
        public Username $username,
        public Email $email,
        public Phone $phone,
        public Password $password,
        public Role $role,
        public TimeOfDay $startTime,
        public TimeOfDay $endTime,
        #[ArrayOf(DayOfWeek::class, minItems: 1, maxItems: 7)]
        public array $workingDays
    ) {}
}
