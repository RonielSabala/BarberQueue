<?php

declare(strict_types=1);

namespace App\Domain\Queue;

use App\Domain\Entities\Turn\TurnEntity;

final class QueueScheduler
{
    /**
     * @param BarberSlotData[]  $barberSlots
     * @param array<int, float> $finishMinutes
     *
     * @return array{?int, ?BarberSlotData}
     */
    private static function pickBestBarber(array $barberSlots, array $finishMinutes): array
    {
        $bestId = null;
        $bestSlot = null;
        $bestTime = PHP_FLOAT_MAX;

        foreach ($barberSlots as $slot) {
            // Unassigned turns only go to barbers who are accepting new clients
            if (!$slot->isAccepting) {
                continue;
            }

            $barberId = $slot->barberId;
            $time = $finishMinutes[$barberId];
            if ($time < $bestTime) {
                $bestTime = $time;
                $bestId = $barberId;
                $bestSlot = $slot;
            }
        }

        return [$bestId, $bestSlot];
    }

    /**
     * @param BarberSlotData[] $barberSlots
     * @param TurnEntity[]     $unassignedTurns
     */
    public static function schedule(array $barberSlots, array $unassignedTurns): ScheduledQueue
    {
        // Initialize state
        $queues = [];
        $slotsById = [];
        $finishMinutes = [];
        $allTurns = $unassignedTurns;

        foreach ($barberSlots as $slot) {
            // Add all turns
            foreach ($slot->assignedTurns as $turn) {
                $allTurns[] = $turn;
            }

            $barberId = $slot->barberId;
            $queues[$barberId] = [];
            $slotsById[$barberId] = $slot;
            $finishMinutes[$barberId] = $slot->estimatedBaseFinishMinutes();
        }

        // Sort the entire pool by creation date
        usort(
            $allTurns,
            static fn (TurnEntity $a, TurnEntity $b) => $a->id->value <=> $b->id->value
        );

        // Process all turns chronologically
        foreach ($allTurns as $turn) {
            $barberId = $turn->barberId?->value;

            // If the turn specifies a barber, we MUST assign it to them
            if ($barberId !== null && isset($queues[$barberId])) {
                $queues[$barberId][] = $turn;
                $finishMinutes[$barberId] += $slotsById[$barberId]->getAvgServiceMinutes();
                continue;
            }

            // Otherwise, pick the best barber based on the current estimated finish times
            [$bestId, $barberSlot] = self::pickBestBarber($barberSlots, $finishMinutes);

            if ($bestId !== null && $barberSlot !== null) {
                $queues[$bestId][] = $turn;
                $finishMinutes[$bestId] += $barberSlot->getAvgServiceMinutes();
            }
        }

        return new ScheduledQueue($barberSlots, $queues);
    }
}
