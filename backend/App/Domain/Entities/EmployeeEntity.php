<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Attributes\ArrayOf;
use App\Domain\ValueObjects\{Email, Id, Phone, Role, Username};

readonly class EmployeeEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Username $username,
        public Email $email,
        public Phone $phone,
        public Role $role,
        #[ArrayOf(EmployeeAssignmentEntity::class)]
        public array $assignments,
    ) {}
}
