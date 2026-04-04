<?php

declare(strict_types=1);

namespace App\Services\Barber;

use App\Core\HttpStatus;
use App\Domain\Enums\RoleEnum;
use App\DTOs\Barbers\Requests\CreateBarberReviewRequest;
use App\DTOs\Barbers\Responses\BarberReviewResponse;
use App\Exceptions\Barber\BarberReviewException;
use App\Repositories\Barber\BarberReviewRepository;
use App\Services\{BaseService, UserService};

class BarberReviewService extends BaseService
{
    public function __construct(
        private readonly BarberReviewRepository $barberReviewRepository,
        private readonly UserService $userService,
        private readonly BarberService $barberService,
    ) {}

    /** @return BarberReviewResponse[] */
    public function getReviews(int $barberId): array
    {
        $this->barberService->validateBarberExists($barberId);
        $reviews = $this->barberReviewRepository->getAllByBarberId($barberId);
        return BarberReviewResponse::fromEntities($reviews);
    }

    public function createReview(int $barberId, CreateBarberReviewRequest $request): BarberReviewResponse
    {
        $this->barberService->validateBarberExists($barberId);

        // Validate client
        $clientId = $request->clientId->value;
        $client = $this->userService->validateUserExists($clientId);
        if ($client->role->value !== RoleEnum::Client->value) {
            throw new BarberReviewException(
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
        $this->barberService->validateBarberExists($barberId);
        return $this->barberReviewRepository->deleteReview($reviewId, $barberId);
    }
}
