<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\{Id, RoleName};

readonly class RoleEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public RoleName $roleName,
    ) {}
}
