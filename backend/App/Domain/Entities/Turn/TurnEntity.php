<?php

declare(strict_types=1);

namespace App\Domain\Entities\Turn;

use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{
    ClientStatus,
    DateTimeString,
    Id,
    OwnerType,
    PositiveInteger,
    Username
};

final readonly class TurnEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Id $ownerId,
        public Id $barbershopId,
        public ?Id $groupId,
        public ?Id $barberId,
        public Username $ownerName,
        public OwnerType $ownerType,
        public ClientStatus $ownerStatus,
        public ?PositiveInteger $groupSize,
        public DateTimeString $createdAt,
        public ?DateTimeString $attendedAt,
        public ?DateTimeString $finishedAt,
    ) {}
}
