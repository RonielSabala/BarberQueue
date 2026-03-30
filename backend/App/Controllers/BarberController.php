<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\{DELETE, GET, PATCH, POST, RoutePrefix};
use App\Core\{HttpResponse, HttpStatus};
use App\DTOs\Barbers\Requests\{CreateBarberReviewRequest, UpdateBarberStatusRequest};
use App\Services\BarberService;

#[RoutePrefix('/api/barbers')]
class BarberController extends BaseController
{
    public function __construct(
        private readonly BarberService $barberService
    ) {}

    #[GET('/{id}')]
    public function get(int $id): void
    {
        $response = $this->barberService->get($id);
        HttpResponse::json($response);
    }

    #[GET('/{id}/dashboard')]
    public function getDashboard(int $id): void
    {
        $response = $this->barberService->getDashboard($id);
        HttpResponse::json($response);
    }

    #[PATCH('/{id}/status')]
    public function updateStatus(int $id, UpdateBarberStatusRequest $request): void
    {
        $this->barberService->updateStatus($id, $request);
        HttpResponse::success('Barber status updated');
    }

    #[GET('/{id}/reviews')]
    public function getReviews(int $id): void
    {
        $response = $this->barberService->getReviews($id);
        HttpResponse::json($response);
    }

    #[POST('/{id}/reviews')]
    public function createReview(int $id, CreateBarberReviewRequest $request): void
    {
        $response = $this->barberService->createReview($id, $request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[DELETE('/{id}/reviews/{reviewId}')]
    public function deleteReview(int $id, int $reviewId): void
    {
        $success = $this->barberService->deleteReview($id, $reviewId);
        if (!$success) {
            HttpResponse::error('Barber review not found', HttpStatus::NotFound);
            return;
        }

        HttpResponse::json(null, HttpStatus::NoContent);
    }
}
