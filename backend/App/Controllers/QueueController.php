<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HttpResponse;
use App\Services\Turn\QueueService;
use App\Attributes\{GET, RoutePrefix};

#[RoutePrefix('/api/queues')]
class QueueController extends BaseController
{
    public function __construct(
        private readonly QueueService $queueService
    ) {}

    #[GET('/barbershop/{barbershopId}')]
    public function getBarbershopQueues(int $barbershopId): void
    {
        $response = $this->queueService->getBarbershopQueues($barbershopId);
        HttpResponse::json($response);
    }

    #[GET('/barber/{barberId}')]
    public function getBarberQueue(int $barberId): void
    {
        $response = $this->queueService->getBarberQueue($barberId);
        HttpResponse::json($response);
    }
}
