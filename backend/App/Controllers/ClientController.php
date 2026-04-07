<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HttpResponse;
use App\Services\Turn\ClientTurnService;
use App\Attributes\{GET, RoutePrefix};

#[RoutePrefix('/api/clients')]
final readonly class ClientController extends BaseController
{
    public function __construct(
        private readonly ClientTurnService $clientTurnService
    ) {}

    #[GET('/{id}/turn')]
    public function getTurn(int $id): void
    {
        $response = $this->clientTurnService->getTurn($id);
        HttpResponse::json($response);
    }
}
