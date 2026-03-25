<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\{GET, POST, RoutePrefix};
use App\Attributes\PATCH;
use App\Core\{HttpResponse, HttpStatus};
use App\DTOs\Barbershops\Requests\{
    CreateBarbershopRequest,
    UpdateBarbershopPhotoRequest,
    UpdateBarbershopRequest
};
use App\DTOs\Barbershops\Requests\UpdateBarbershopStatusRequest;
use App\Services\BarbershopService;

#[RoutePrefix('/api/barbershops')]
class BarbershopController extends BaseController
{
    public function __construct(
        private readonly BarbershopService $barbershopService
    ) {}

    #[GET('')]
    public function getAll(?string $search = null, ?bool $isOpen = null): void
    {
        $response = $this->barbershopService->getAll($search, $isOpen);
        HttpResponse::json($response);
    }

    #[POST('')]
    public function create(CreateBarbershopRequest $request): void
    {
        $response = $this->barbershopService->create($request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[GET('/{id}')]
    public function getBarbershop(int $id): void
    {
        $response = $this->barbershopService->getBarbershop($id);
        HttpResponse::json($response);
    }

    #[PATCH('/{id}')]
    public function updateBarbershop(int $id, UpdateBarbershopRequest $request): void
    {
        $this->barbershopService->updateBarbershopFields($id, $request);
        HttpResponse::success('Barbershop updated');
    }

    #[PATCH('/{id}/status')]
    public function updateBarbershopStatus(int $id, UpdateBarbershopStatusRequest $request): void
    {
        $this->barbershopService->updateBarbershopFields($id, $request);
        HttpResponse::success('Barbershop status updated');
    }

    #[PATCH('/{id}/photo')]
    public function updateBarbershopPhoto(int $id, UpdateBarbershopPhotoRequest $request): void
    {
        $this->barbershopService->updateBarbershopFields($id, $request);
        HttpResponse::success('Barbershop photo updated');
    }
}
