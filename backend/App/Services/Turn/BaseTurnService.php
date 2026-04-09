<?php

declare(strict_types=1);

namespace App\Services\Turn;

use App\Repositories\Turn\TurnRepository;
use App\Services\BaseService;
use App\Domain\Queue\{QueueScheduler, ScheduledQueue};

abstract readonly class BaseTurnService extends BaseService
{
    protected function getScheduledQueue(TurnRepository $turnRepository, int $barbershopId): ScheduledQueue
    {
        [$slots, $unassignedTurns] = $turnRepository->getBarberSlots($barbershopId);
        return QueueScheduler::schedule($slots ?? [], $unassignedTurns ?? []);
    }
}
