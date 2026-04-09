<?php

declare(strict_types=1);

namespace App\Services\Turn;

use App\Core\HttpStatus;
use App\Domain\Entities\Turn\TurnEntity;
use App\Exceptions\Turn\QueueException;
use App\Services\Barbershop\BarbershopService;
use App\Domain\Queue\{BarberSlotData, ScheduledQueue};
use App\DTOs\Queues\Responses\{QueueResponse, TurnResponse};
use App\Repositories\{Turn\QueueRepository, Turn\TurnRepository, AssignmentRepository};

final readonly class QueueService extends BaseTurnService
{
    public function __construct(
        private readonly AssignmentRepository $assignmentRepository,
        private readonly TurnRepository $turnRepository,
        private readonly QueueRepository $queueRepository,
        private readonly BarbershopService $barbershopService,
    ) {}

    private function buildQueueResponse(
        BarberSlotData $slot,
        ScheduledQueue $scheduled
    ): QueueResponse {
        $barberId = $slot->barberId;
        $barberQueue = $scheduled->queueOf($barberId);

        return new QueueResponse(
            barberId: $barberId,
            barberName: $slot->barberName,
            barberStatus: $slot->barberStatus,
            isAccepting: $slot->isAccepting,
            turns: array_map(
                static fn (TurnEntity $turn) => TurnResponse::fromEntity(
                    $turn,
                    [
                        'position' => $scheduled->positionOf(
                            $barberQueue,
                            $turn->id->value
                        ),
                    ]
                ),
                $barberQueue
            ),
        );
    }

    /** @return QueueResponse[] */
    public function getBarbershopQueues(int $barbershopId): array
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);

        $scheduled = $this->getScheduledQueue($this->turnRepository, $barbershopId);
        return array_map(
            fn (BarberSlotData $slot) => $this->buildQueueResponse($slot, $scheduled),
            $scheduled->barberSlots
        );
    }

    public function getBarberQueue(int $barberId): QueueResponse
    {
        $barbershopId = $this->queueRepository->findActiveBarbershopForBarber($barberId) ?? $this->assignmentRepository->getBarbershopIdByStaffId($barberId);

        $slot = $barbershopId !== null
            ? $this->queueRepository->getSingleBarberSlot($barbershopId, $barberId)
            : null;

        if ($slot === null) {
            throw new QueueException('Barber not found', HttpStatus::NotFound);
        }

        $scheduled = $this->getScheduledQueue($this->turnRepository, $barbershopId);
        return $this->buildQueueResponse($slot, $scheduled);
    }
}
