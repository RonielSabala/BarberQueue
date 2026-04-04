<?php

declare(strict_types=1);

namespace App\Domain\Queue;

/**
 * Tracks per-barber estimated finish times during a turn creation sequence.
 */
final class SlotFinishTimeTracker
{
    /** @var array<int, float> */
    private array $finishMinutes;

    /** @var array<int, float> */
    private array $avgMinutes;

    /** @param BarberSlotData[] $barberSlots */
    public function __construct(array $barberSlots)
    {
        $this->finishMinutes = [];
        $this->avgMinutes = [];

        foreach ($barberSlots as $slot) {
            if (!$slot->isAccepting) {
                continue;
            }

            $barberId = $slot->barberId;
            $this->finishMinutes[$barberId] = $slot->estimatedFinishMinutes();
            $this->avgMinutes[$barberId] = $slot->getAvgServiceMinutes();
        }
    }

    /**
     * Returns the barberId with the shortest current finish time and
     * advances that barber's estimate by their average service time.
     *
     * Returns null if no accepting barbers are available.
     */
    public function pickBestAndAdvance(): ?int
    {
        if (empty($this->finishMinutes)) {
            return null;
        }

        $bestId = array_key_first($this->finishMinutes);
        foreach ($this->finishMinutes as $barberId => $time) {
            if ($time < $this->finishMinutes[$bestId]) {
                $bestId = $barberId;
            }
        }

        $this->finishMinutes[$bestId] += $this->avgMinutes[$bestId];
        return $bestId;
    }
}
