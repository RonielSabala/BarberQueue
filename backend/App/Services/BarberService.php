<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Enums\RoleEnum;
use App\DTOs\Barbers\Requests\{CreateBarberReviewRequest, UpdateBarberStatusRequest};
use App\DTOs\Barbers\Responses\{BarberDashboardResponse, BarberResponse, BarberReviewResponse};
use App\Exceptions\BarberException;
use App\Repositories\{BarberRepository, BarberReviewRepository, UserRepository};

class BarberService extends BaseService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly BarberRepository $barberRepository,
        private readonly BarberReviewRepository $barberReviewRepository,
        private readonly UserService $userService,
    ) {}

    private function validateBarber(int $barberId): void
    {
        $barber = $this->userRepository->getById($barberId);
        if ($barber === null) {
            throw new BarberException('Barber not found', HttpStatus::NotFound);
        }

        if ($barber->role->value !== RoleEnum::Barber->value) {
            throw new BarberException('This user is not a barber', HttpStatus::NotFound);
        }
    }

    public function get(int $barberId): BarberResponse
    {
        $barber = $this->barberRepository->getById($barberId);
        if ($barber === null) {
            throw new BarberException('Barber not found', HttpStatus::NotFound);
        }

        return BarberResponse::fromEntity($barber);
    }

    public function getDashboard(int $barberId): BarberDashboardResponse
    {
        $this->validateBarber($barberId);

        $dashboard = $this->barberRepository->getDashboard($barberId);
        if ($dashboard === null) {
            throw new \RuntimeException('Failed to generate barber dashboard');
        }

        return BarberDashboardResponse::fromEntity($dashboard);
    }

    public function updateStatus(int $barberId, UpdateBarberStatusRequest $request): void
    {
        $this->validateBarber($barberId);
        $fields = $this->validateFieldsToUpdate($request);
        $this->barberRepository->updateStatus($barberId, $fields);
    }

    /** @return BarberReviewResponse[] */
    public function getReviews(int $barberId): array
    {
        $this->validateBarber($barberId);
        $reviews = $this->barberReviewRepository->getAllByBarberId($barberId);
        return BarberReviewResponse::fromEntities($reviews);
    }

    public function createReview(int $barberId, CreateBarberReviewRequest $request): BarberReviewResponse
    {
        $this->validateBarber($barberId);

        // Validate client
        $clientId = $request->clientId->value;
        $client = $this->userService->validateUserExists($clientId);
        if ($client->role->value !== RoleEnum::Client->value) {
            throw new BarberException(
                'Only clients can leave barber reviews',
                HttpStatus::Forbidden
            );
        }

        $review = $this->barberReviewRepository->createReview(
            clientId: $clientId,
            barberId: $barberId,
            rating: $request->rating->value,
            content: $request->content->value,
        );

        if ($review === null) {
            throw new \RuntimeException('Failed to save barber review');
        }

        return BarberReviewResponse::fromEntity($review);
    }

    public function deleteReview(int $barberId, int $reviewId): bool
    {
        $this->validateBarber($barberId);
        return $this->barberReviewRepository->deleteReview($reviewId, $barberId);
    }
}
