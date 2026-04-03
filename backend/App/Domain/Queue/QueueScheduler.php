<?php

declare(strict_types=1);

namespace App\Domain\Queue;

use App\Domain\Entities\Turn\TurnEntity;

final class QueueScheduler
{
    /**
     * @param TurnEntity[] $turns
     *
     * @return TurnEntity[]
     */
    private static function sortByCreatedAt(array $turns): array
    {
        usort(
            $turns,
            static fn (TurnEntity $turnA, TurnEntity $turnB) => (
                $turnA->createdAt->value <=> $turnB->createdAt->value
            )
        );

        return $turns;
    }

    /**
     * @param BarberSlotData[] $barberSlots
     *
     * @return array{array<int,float>, array<int,TurnEntity[]>}
     */
    private static function initBarberState(array $barberSlots): array
    {
        $finishMinutes = [];
        $queues = [];

        foreach ($barberSlots as $slot) {
            $barberId = $slot->barberId;
            $queues[$barberId] = $slot->assignedTurns;
            $finishMinutes[$barberId] = $slot->estimatedFinishMinutes();
        }

        return [$finishMinutes, $queues];
    }

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
     * @param TurnEntity[]     $unassignedTurns turns where barber_id IS NULL
     */
    public static function schedule(array $barberSlots, array $unassignedTurns): ScheduledQueue
    {
        [$finishMinutes, $queues] = self::initBarberState($barberSlots);

        foreach (self::sortByCreatedAt($unassignedTurns) as $turn) {
            [$bestId, $barberSlot] = self::pickBestBarber($barberSlots, $finishMinutes);
            if ($bestId === null || $barberSlot === null) {
                break;
            }

            $queues[$bestId][] = $turn;
            $finishMinutes[$bestId] += $barberSlot->getAvgServiceMinutes();
        }

        return new ScheduledQueue($barberSlots, $queues);
    }
}
