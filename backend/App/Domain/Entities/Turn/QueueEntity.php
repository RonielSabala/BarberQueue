<?php

declare(strict_types=1);

namespace App\Domain\Entities\Turn;

use App\Attributes\ArrayOf;
use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{BarberStatus, Id, PhotoUrl, Username};

readonly class QueueEntity extends BaseEntity
{
    public function __construct(
        public Id $barberId,
        public Username $barberName,
        public BarberStatus $barberStatus,
        public ?PhotoUrl $barberPhotoUrl,
        public bool $isAccepting,
        #[ArrayOf(TurnEntity::class)]
        public array $turns,
    ) {}
}
