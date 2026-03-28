<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Attributes\ArrayOf;
use App\Domain\ValueObjects\{Email, Id, Phone, RoleName, Username};

readonly class Employee extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Username $username,
        public Email $email,
        public Phone $phone,
        public RoleName $role,
        #[ArrayOf(EmployeeAssignment::class)]
        public array $assignments,
    ) {}
}
