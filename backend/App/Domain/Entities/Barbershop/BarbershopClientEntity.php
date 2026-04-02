<?php

declare(strict_types=1);

namespace App\Domain\Entities\Barbershop;

use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{ClientStatus, Id, Username};

final readonly class BarbershopClientEntity extends BaseEntity
{
    public function __construct(
        public Id $clientId,
        public ?Id $barbershopId,
        public ClientStatus $currentStatus,
        public Username $username,
    ) {}
}
