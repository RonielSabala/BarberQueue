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
        public bool $isAccepting,
        public ?float $avgServiceMinutes,
        public array $assignedTurns,
    ) {}

    /**
     * @param TurnEntity[] $assignedTurns
     */
    public static function fromDbRow(array $row, array $assignedTurns): self
    {
        $avgServiceMinutes = isset($row['avg_service_minutes']) ? (float) $row['avg_service_minutes'] : null;
        return new self(
            barberId: (int) $row['barber_id'],
            barberName: $row['barber_name'],
            barberStatus: $row['barber_status'],
            isAccepting: (bool) $row['is_accepting'],
            avgServiceMinutes: $avgServiceMinutes,
            assignedTurns: $assignedTurns,
        );
    }

    public function getAvgServiceMinutes(): float
    {
        return $this->avgServiceMinutes ?? self::DEFAULT_AVG_MINUTES;
    }

    /** Estimated minutes until the barber finishes their current queue. */
    public function estimatedBaseFinishMinutes(): float
    {
        return \count($this->assignedTurns) * $this->getAvgServiceMinutes();
    }
}
