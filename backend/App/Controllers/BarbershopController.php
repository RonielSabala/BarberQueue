<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\{DELETE, GET, PATCH, POST, RoutePrefix};
use App\Core\{HttpResponse, HttpStatus};
use App\DTOs\Barbershops\Requests\{
    AssignBarbershopEmployeeRequest,
    CreateBarbershopEmployeeRequest,
    CreateBarbershopPhotosRequest,
    CreateBarbershopRequest,
    CreateBarbershopReviewRequest,
    UpdateBarbershopPhotoRequest,
    UpdateBarbershopRequest,
    UpdateBarbershopStatusRequest
};
use App\Services\Barbershop\{
    BarbershopClientService,
    BarbershopEmployeeService,
    BarbershopPhotoService,
    BarbershopReviewService,
    BarbershopService
};

#[RoutePrefix('/api/barbershops')]
final readonly class BarbershopController extends BaseController
{
    public function __construct(
        private readonly BarbershopService $barbershopService,
        private readonly BarbershopPhotoService $barbershopPhotoService,
        private readonly BarbershopReviewService $barbershopReviewService,
        private readonly BarbershopEmployeeService $barbershopEmployeeService,
        private readonly BarbershopClientService $BarbershopClientService
    ) {}

    #[GET('')]
    public function getAll(
        ?string $search = null,
        ?bool $isOpen = null,
        ?int $adminId = null
    ): void {
        $response = $this->barbershopService->getAll($search, $isOpen, $adminId);
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

    #[GET('/{id}/dashboard')]
    public function getDashboard(int $id): void
    {
        $response = $this->barbershopService->getDashboard($id);
        HttpResponse::json($response);
    }

    #[PATCH('/{id}')]
    public function update(int $id, UpdateBarbershopRequest $request): void
    {
        $this->barbershopService->update($id, $request);
        HttpResponse::success('Barbershop updated');
    }

    #[PATCH('/{id}/status')]
    public function updateStatus(int $id, UpdateBarbershopStatusRequest $request): void
    {
        $this->barbershopService->update($id, $request);
        HttpResponse::success('Barbershop status updated');
    }

    #[PATCH('/{id}/photo')]
    public function updatePhoto(int $id, UpdateBarbershopPhotoRequest $request): void
    {
        $this->barbershopService->update($id, $request);
        HttpResponse::success('Barbershop photo updated');
    }

    // Photos

    #[GET('/{id}/photos')]
    public function getPhotos(int $id): void
    {
        $response = $this->barbershopPhotoService->getPhotos($id);
        HttpResponse::json($response);
    }

    #[POST('/{id}/photos')]
    public function createPhotos(int $id, CreateBarbershopPhotosRequest $request): void
    {
        $response = $this->barbershopPhotoService->createPhotos($id, $request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[DELETE('/{id}/photos/{photoId}')]
    public function deletePhoto(int $id, int $photoId): void
    {
        $success = $this->barbershopPhotoService->deletePhoto($id, $photoId);
        if (!$success) {
            HttpResponse::error('Barbershop photo not found', HttpStatus::NotFound);
            return;
        }

        HttpResponse::json(null, HttpStatus::NoContent);
    }

    // Reviews

    #[GET('/{id}/reviews')]
    public function getReviews(int $id): void
    {
        $response = $this->barbershopReviewService->getReviews($id);
        HttpResponse::json($response);
    }

    #[POST('/{id}/reviews')]
    public function createReview(int $id, CreateBarbershopReviewRequest $request): void
    {
        $response = $this->barbershopReviewService->createReview($id, $request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[DELETE('/{id}/reviews/{reviewId}')]
    public function deleteReview(int $id, int $reviewId): void
    {
        $success = $this->barbershopReviewService->deleteReview($id, $reviewId);
        if (!$success) {
            HttpResponse::error('Barbershop review not found', HttpStatus::NotFound);
            return;
        }

        HttpResponse::json(null, HttpStatus::NoContent);
    }

    // Employees

    #[GET('/{id}/employees')]
    public function getEmployees(int $id): void
    {
        $response = $this->barbershopEmployeeService->getEmployees($id);
        HttpResponse::json($response);
    }

    #[POST('/{id}/employees')]
    public function createEmployee(int $id, CreateBarbershopEmployeeRequest $request): void
    {
        $response = $this->barbershopEmployeeService->createEmployee($id, $request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[POST('/{id}/employees/{employeeId}')]
    public function assignEmployee(int $id, int $employeeId, AssignBarbershopEmployeeRequest $request): void
    {
        $this->barbershopEmployeeService->assignEmployee($id, $employeeId, $request);
        HttpResponse::success('Employee assigned to barbershop');
    }

    #[DELETE('/{id}/employees/{employeeId}')]
    public function deleteEmployeeAssignment(int $id, int $employeeId): void
    {
        $success = $this->barbershopEmployeeService->deleteEmployeeAssignment($id, $employeeId);
        if (!$success) {
            HttpResponse::error('Assignment not found', HttpStatus::NotFound);
            return;
        }

        HttpResponse::json(null, HttpStatus::NoContent);
    }

    // Clients

    #[GET('/{id}/clients')]
    public function getAllAtBarbershop(int $barbershopId): void
    {
        $response = $this->BarbershopClientService->getAllAtBarbershop($barbershopId);
        HttpResponse::json($response);
    }

    #[POST('/{id}/clients/{clientId}')]
    public function checkIn(int $barbershopId, int $clientId): void
    {
        $this->BarbershopClientService->checkIn($barbershopId, $clientId);
        HttpResponse::json(null, HttpStatus::NoContent);
    }

    #[DELETE('/{id}/clients/{clientId}')]
    public function checkOut(int $barbershopId, int $clientId): void
    {
        $this->BarbershopClientService->checkOut($barbershopId, $clientId);
        HttpResponse::json(null, HttpStatus::NoContent);
    }
}
