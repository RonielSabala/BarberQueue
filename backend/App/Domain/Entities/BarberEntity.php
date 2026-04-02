<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\{BarberStatus, Id, Username};

readonly class BarberEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Username $username,
        public BarberStatus $currentStatus,
        public bool $isAccepting,
    ) {}
}
