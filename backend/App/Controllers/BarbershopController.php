<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\{DELETE, GET, POST, RoutePrefix};
use App\Attributes\PATCH;
use App\Core\{HttpResponse, HttpStatus};
use App\DTOs\Barbershops\Requests\{
    CreateBarbershopEmployeeRequest,
    CreateBarbershopPhotosRequest,
    CreateBarbershopRequest,
    CreateBarbershopReviewRequest,
    UpdateBarbershopPhotoRequest,
    UpdateBarbershopRequest,
    UpdateBarbershopStatusRequest
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
    public function get(int $id): void
    {
        $response = $this->barbershopService->get($id);
        HttpResponse::json($response);
    }

    #[PATCH('/{id}')]
    public function update(int $id, UpdateBarbershopRequest $request): void
    {
        $this->barbershopService->updateFields($id, $request);
        HttpResponse::success('Barbershop updated');
    }

    #[PATCH('/{id}/status')]
    public function updateStatus(int $id, UpdateBarbershopStatusRequest $request): void
    {
        $this->barbershopService->updateFields($id, $request);
        HttpResponse::success('Barbershop status updated');
    }

    #[PATCH('/{id}/photo')]
    public function updatePhoto(int $id, UpdateBarbershopPhotoRequest $request): void
    {
        $this->barbershopService->updateFields($id, $request);
        HttpResponse::success('Barbershop photo updated');
    }

    #[GET('/{id}/photos')]
    public function getPhotos(int $id): void
    {
        $response = $this->barbershopService->getPhotos($id);
        HttpResponse::json($response);
    }

    #[POST('/{id}/photos')]
    public function addPhotos(int $id, CreateBarbershopPhotosRequest $request): void
    {
        $response = $this->barbershopService->addPhotos($id, $request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[DELETE('/{id}/photos/{photoId}')]
    public function deletePhoto(int $id, int $photoId): void
    {
        $success = $this->barbershopService->deletePhoto($id, $photoId);
        if (!$success) {
            HttpResponse::error('Barbershop photo not found', HttpStatus::NotFound);
            return;
        }

        HttpResponse::json(null, HttpStatus::NoContent);
    }

    #[GET('/{id}/reviews')]
    public function getReviews(int $id): void
    {
        $response = $this->barbershopService->getReviews($id);
        HttpResponse::json($response);
    }

    #[POST('/{id}/reviews')]
    public function addReview(int $id, CreateBarbershopReviewRequest $request): void
    {
        $response = $this->barbershopService->addReview($id, $request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[DELETE('/{id}/reviews/{reviewId}')]
    public function deleteReview(int $id, int $reviewId): void
    {
        $success = $this->barbershopService->deleteReview($id, $reviewId);
        if (!$success) {
            HttpResponse::error('Barbershop review not found', HttpStatus::NotFound);
            return;
        }

        HttpResponse::json(null, HttpStatus::NoContent);
    }

    #[GET('/{id}/employees')]
    public function getEmployees(int $id): void
    {
        $response = $this->barbershopService->getEmployees($id);
        HttpResponse::json($response);
    }

    #[POST('/{id}/employees')]
    public function createEmployee(int $id, CreateBarbershopEmployeeRequest $request): void
    {
        $response = $this->barbershopService->createEmployee($id, $request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[DELETE('/{id}/employees/{employeeId}')]
    public function deleteEmployeeAssignment(int $id, int $employeeId): void
    {
        $success = $this->barbershopService->deleteEmployeeAssignment($id, $employeeId);
        if (!$success) {
            HttpResponse::error('Assignment not found', HttpStatus::NotFound);
            return;
        }

        HttpResponse::json(null, HttpStatus::NoContent);
    }
}
