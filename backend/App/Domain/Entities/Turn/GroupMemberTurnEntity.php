<?php

declare(strict_types=1);

namespace App\Domain\Entities\Turn;

use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{ClientStatus, DateTimeString, Id, Username};

final readonly class GroupMemberTurnEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Id $barbershopId,
        public Id $memberId,
        public Id $groupId,
        public ?Id $barberId,
        public Username $memberName,
        public ClientStatus $status,
        public DateTimeString $createdAt,
    ) {}
}
