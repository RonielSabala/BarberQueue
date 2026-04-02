<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Enums\RoleEnum;
use App\DTOs\Barbershops\Requests\CreateBarbershopReviewRequest;
use App\DTOs\Barbershops\Responses\BarbershopReviewResponse;
use App\Exceptions\BarbershopReviewException;
use App\Repositories\BarbershopReviewRepository;

class BarbershopReviewService extends BaseService
{
    public function __construct(
        private readonly BarbershopReviewRepository $barbershopReviewRepository,
        private readonly UserService $userService,
        private readonly BarbershopService $barbershopService,
    ) {}

    /** @return BarbershopReviewResponse[] */
    public function getReviews(int $barbershopId): array
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        $barbershopReviews = $this->barbershopReviewRepository->getAllByBarbershopId($barbershopId);
        return BarbershopReviewResponse::fromEntities($barbershopReviews);
    }

    public function createReview(int $barbershopId, CreateBarbershopReviewRequest $request): BarbershopReviewResponse
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);

        $clientId = $request->clientId->value;
        $client = $this->userService->validateUserExists($clientId);

        if ($client->role->value !== RoleEnum::Client->value) {
            throw new BarbershopReviewException('Only clients can leave barbershop reviews', HttpStatus::Forbidden);
        }

        $barbershopReview = $this->barbershopReviewRepository->createReview(
            $clientId,
            $barbershopId,
            $request->rating->value,
            $request->content->value
        );

        if ($barbershopReview === null) {
            throw new \RuntimeException('Failed to save barbershop review');
        }

        return BarbershopReviewResponse::fromEntity($barbershopReview);
    }

    public function deleteReview(int $barbershopId, int $reviewId): bool
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        return $this->barbershopReviewRepository->deleteReview($barbershopId, $reviewId);
    }
}
