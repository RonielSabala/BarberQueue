<?php

declare(strict_types=1);

namespace App\Domain\Queue;

use App\Domain\Entities\Turn\TurnEntity;
use App\Domain\Enums\ClientStatusEnum;

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
     * Finds the first non-waiting turn and moves it to position 0. All other
     * turns keep their relative order.
     *
     * @param TurnEntity[] $queue
     *
     * @return TurnEntity[]
     */
    private static function promoteFirstNonWaiting(array $queue): array
    {
        foreach ($queue as $i => $turn) {
            if ($turn->ownerStatus->value === ClientStatusEnum::Waiting->value) {
                continue;
            }

            array_splice($queue, $i, 1);
            array_unshift($queue, $turn);
            return $queue;
        }

        return $queue;
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
            foreach ($slot->assignedTurns as $turn) {
                $allTurns[] = $turn;
            }

            $barberId = $slot->barberId;
            $queues[$barberId] = [];
            $slotsById[$barberId] = $slot;
            $finishMinutes[$barberId] = 0;
        }

        // Sort the entire pool by creation date
        usort(
            $allTurns,
            static fn (TurnEntity $a, TurnEntity $b) => $a->id->value <=> $b->id->value
        );

        // Process all turns
        foreach ($allTurns as $turn) {
            $barberId = $turn->barberId?->value;

            // If the turn specifies a barber, we MUST assign it to them
            if ($barberId !== null && isset($queues[$barberId])) {
                $queues[$barberId][] = $turn;
                $finishMinutes[$barberId] += $slotsById[$barberId]->avgServiceMinutes;
                continue;
            }

            // Otherwise, pick the best barber based on the current estimated finish times
            [$bestId, $barberSlot] = self::pickBestBarber($barberSlots, $finishMinutes);
            if ($bestId !== null && $barberSlot !== null) {
                $queues[$bestId][] = $turn;
                $finishMinutes[$bestId] += $barberSlot->avgServiceMinutes;
            }
        }

        // Promote position-1 turns if applicable
        foreach ($queues as $barberId => $queue) {
            if (empty($queue)) {
                continue;
            }

            if ($queue[0]->ownerStatus->value === ClientStatusEnum::Waiting->value) {
                $queues[$barberId] = self::promoteFirstNonWaiting($queue);
            }
        }

        return new ScheduledQueue($barberSlots, $slotsById, $queues, $allTurns);
    }
}
