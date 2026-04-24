<?php

declare(strict_types=1);

namespace App\Domain\Queue;

use App\Domain\Entities\Turn\TurnEntity;

final readonly class ScheduledQueue
{
    /**
     * @param BarberSlotData[]           $barberSlots
     * @param array<int, BarberSlotData> $slotsById
     * @param array<int, TurnEntity[]>   $queues
     * @param TurnEntity[]               $allTurnsSortedById
     */
    public function __construct(
        public array $barberSlots,
        public array $slotsById,
        public array $queues,
        public array $allTurnsSortedById,
    ) {}

    /** @return TurnEntity[] */
    public function queueOf(int $barberId): array
    {
        return $this->queues[$barberId] ?? [];
    }

    /**
     * Position of a turn within a known barber queue (1-indexed).
     *
     * @param TurnEntity[] $queue
     */
    public function positionOf(array $queue, int $turnId): ?int
    {
        foreach ($queue as $i => $turn) {
            if ($turn->id->value === $turnId) {
                return $i + 1;
            }
        }

        return null;
    }

    /**
     * Finds both the 1-indexed position and the barber ID for a given turn.
     *
     * * @return null|array{int, int}
     */
    public function findTurnLocation(int $turnId): ?array
    {
        foreach ($this->queues as $barberId => $queue) {
            $position = $this->positionOf($queue, $turnId);
            if ($position === null) {
                continue;
            }

            return [$position, (int) $barberId];
        }

        return null;
    }

    public function findTurnPosition(int $turnId): ?int
    {
        return $this->findTurnLocation($turnId)[0] ?? null;
    }

    public function findTurnBarberId(int $turnId): ?int
    {
        return $this->findTurnLocation($turnId)[1] ?? null;
    }

    /** 1-indexed position of the turn in the global list of ALL active turns. */
    public function absolutePositionOf(int $turnId): ?int
    {
        foreach ($this->allTurnsSortedById as $i => $turn) {
            if ($turn->id->value === $turnId) {
                return $i + 1;
            }
        }

        return null;
    }

    /** Estimated minutes until the turn gets attended. */
    public function estimatedWaitMinutesFor(int $turnId): ?float
    {
        $location = $this->findTurnLocation($turnId);
        if ($location === null) {
            return null;
        }

        [$position, $barberId] = $location;
        return ($position - 1) * $this->slotsById[$barberId]?->avgServiceMinutes;
    }
}
