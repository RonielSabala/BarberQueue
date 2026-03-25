<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\{DELETE, GET, POST, RoutePrefix};
use App\Attributes\PATCH;
use App\Core\{HttpResponse, HttpStatus};
use App\DTOs\Barbershops\Requests\{
    AddBarbershopPhotosRequest,
    UpdateBarbershopStatusRequest
};
use App\DTOs\Barbershops\Requests\{
    CreateBarbershopRequest,
    UpdateBarbershopPhotoRequest,
    UpdateBarbershopRequest
};
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

    #[GET('/{id}/photos')]
    public function getBarbershopPhotos(int $id): void
    {
        $response = $this->barbershopService->getBarbershopPhotos($id);
        HttpResponse::json($response);
    }

    #[POST('/{id}/photos')]
    public function addBarbershopPhotos(int $id, AddBarbershopPhotosRequest $request): void
    {
        $response = $this->barbershopService->addBarbershopPhotos($id, $request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[DELETE('/{id}/photos/{photoId}')]
    public function deleteBarbershopPhoto(int $id, int $photoId): void
    {
        $deleted = $this->barbershopService->deleteBarbershopPhoto($id, $photoId);
        if (!$deleted) {
            HttpResponse::error('Photo not found', HttpStatus::NotFound);
            return;
        }

        HttpResponse::json(null, HttpStatus::NoContent);
    }
}
