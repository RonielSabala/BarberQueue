<?php

declare(strict_types=1);

namespace App\Domain\Entities\Turn;

use App\Attributes\ArrayOf;
use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{BarberStatus, Id, Username};

readonly class QueueEntity extends BaseEntity
{
    public function __construct(
        public Id $barberId,
        public Username $barberName,
        public BarberStatus $barberStatus,
        public bool $isAccepting,
        #[ArrayOf(TurnEntity::class)]
        public array $turns,
    ) {}

    public static function fromBarberRow(array $barberRow, $turnRows): self
    {
        return new static(
            barberId: new Id($barberRow['barber_id']),
            barberName: new Username($barberRow['barber_name']),
            barberStatus: new BarberStatus($barberRow['barber_status']),
            isAccepting: (bool) $barberRow['is_accepting'],
            turns: array_map(
                static fn (array $turnRow) => TurnEntity::fromDbRow($turnRow),
                $turnRows
            )
        );
    }
}
