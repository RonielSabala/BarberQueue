<?php

declare(strict_types=1);

namespace App\Controllers;

use App\DTOs\Turns\Requests\CreateTurnRequest;
use App\Services\Turn\TurnService;
use App\Attributes\{DELETE, GET, PATCH, POST, RoutePrefix};
use App\Core\{HttpResponse, HttpStatus};

#[RoutePrefix('/api/turns')]
class TurnController extends BaseController
{
    public function __construct(
        private readonly TurnService $turnService
    ) {}

    #[GET('/{id}')]
    public function getTurn(int $id): void
    {
        $response = $this->turnService->getTurn($id);
        HttpResponse::json($response);
    }

    #[POST('')]
    public function createTurn(CreateTurnRequest $request): void
    {
        $response = $this->turnService->createTurn($request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[DELETE('/{id}')]
    public function deleteTurn(int $id): void
    {
        $this->turnService->deleteTurn($id);
        HttpResponse::json(null, HttpStatus::NoContent);
    }

    #[PATCH('/{id}/wait')]
    public function waitTurn(int $id): void
    {
        $response = $this->turnService->waitTurn($id);
        HttpResponse::json($response);
    }

    #[PATCH('/{id}/unwait')]
    public function unwaitTurn(int $id): void
    {
        $response = $this->turnService->unwaitTurn($id);
        HttpResponse::json($response);
    }

    #[PATCH('/{id}/attend')]
    public function attendTurn(int $id): void
    {
        $response = $this->turnService->attendTurn($id);
        HttpResponse::json($response);
    }

    #[PATCH('/{id}/pay')]
    public function payTurn(int $id): void
    {
        $response = $this->turnService->payTurn($id);
        HttpResponse::json($response);
    }
}
