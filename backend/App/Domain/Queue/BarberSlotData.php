<?php

declare(strict_types=1);

namespace App\Domain\Queue;

use App\Domain\Entities\Turn\TurnEntity;

final readonly class BarberSlotData
{
    private const float DEFAULT_AVG_MINUTES = 20.0;

    /**
     * @param TurnEntity[] $assignedTurns
     */
    public function __construct(
        public int $barberId,
        public string $barberName,
        public string $barberStatus,
        public ?string $barberPhotoUrl,
        public bool $isAccepting,
        public float $avgServiceMinutes,
        public array $assignedTurns,
    ) {}

    /**
     * @param TurnEntity[] $assignedTurns
     */
    public static function fromDbRow(array $row, array $assignedTurns): self
    {
        $avgServiceMinutes = $row['avg_service_minutes'];
        return new self(
            barberId: (int) $row['barber_id'],
            barberName: $row['barber_name'],
            barberStatus: $row['barber_status'],
            barberPhotoUrl: $row['barber_photo_url'],
            isAccepting: (bool) $row['is_accepting'],
            avgServiceMinutes: $avgServiceMinutes ? (float) $avgServiceMinutes : self::DEFAULT_AVG_MINUTES,
            assignedTurns: $assignedTurns,
        );
    }
}
