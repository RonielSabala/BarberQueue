<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\Barbershop;
use App\Domain\ValueObjects\Role;
use App\DTOs\Barbershops\Requests\{
    AddBarbershopPhotosRequest,
    CreateBarbershopRequest,
    CreateBarbershopReviewRequest
};
use App\DTOs\Barbershops\Responses\{
    AddBarbershopPhotosResponse,
    BarbershopDetailResponse,
    BarbershopPhotoResponse,
    BarbershopResponse,
    BarbershopReviewResponse,
    CreateBarbershopResponse,
    GetBarbershopPhotosResponse
};
use App\DTOs\BaseRequest;
use App\Exceptions\BarbershopException;
use App\Repositories\BarbershopRepository;

class BarbershopService extends BaseService
{
    public function __construct(
        private readonly UserService $userService,
        private readonly BarbershopRepository $barbershopRepository,
    ) {}

    private function validateBarbershopExists(int $barbershopId): Barbershop
    {
        $barbershop = $this->barbershopRepository->findById($barbershopId);
        if ($barbershop === null) {
            throw new BarbershopException('Barbershop not found', HttpStatus::NotFound);
        }

        return $barbershop;
    }

    public function getAll(?string $search, ?bool $isOpen): array
    {
        $barbershops = $this->barbershopRepository->findAll($search, $isOpen);
        return array_map(
            static fn ($barbershop) => BarbershopResponse::fromEntity($barbershop),
            $barbershops
        );
    }

    public function create(CreateBarbershopRequest $request): CreateBarbershopResponse
    {
        $email = $request->email->value;
        $existing = $this->barbershopRepository->findByEmail($email);

        if ($existing !== null) {
            throw new BarbershopException('Email already in use', HttpStatus::Conflict);
        }

        $barbershop = $this->barbershopRepository->create(
            $request->barbershopName,
            $request->email,
            $request->phone,
            $request->barbershopAddress,
            $request->photoUrl,
            $request->opensAt,
            $request->closesAt,
            $request->capacity
        );

        return CreateBarbershopResponse::fromEntity($barbershop);
    }

    public function getBarbershop(int $barbershopId): BarbershopDetailResponse
    {
        $barbershop = $this->validateBarbershopExists($barbershopId);
        return BarbershopDetailResponse::fromEntity($barbershop);
    }

    public function updateBarbershopFields(int $barbershopId, BaseRequest $request): void
    {
        $this->validateBarbershopExists($barbershopId);
        $fields = $this->validateFieldsToUpdate($request);
        $this->barbershopRepository->updateFields($barbershopId, $fields);
    }

    public function getBarbershopPhotos(int $barbershopId): GetBarbershopPhotosResponse
    {
        $this->validateBarbershopExists($barbershopId);
        $barbershopPhotos = $this->barbershopRepository->getPhotos($barbershopId);
        $photos = array_map(
            static fn ($barbershopPhoto) => BarbershopPhotoResponse::fromEntity($barbershopPhoto),
            $barbershopPhotos
        );

        return new GetBarbershopPhotosResponse(photos: $photos);
    }

    public function addBarbershopPhotos(int $barbershopId, AddBarbershopPhotosRequest $request): AddBarbershopPhotosResponse
    {
        $this->validateBarbershopExists($barbershopId);
        $barbershopPhotos = $this->barbershopRepository->addPhotos($barbershopId, $request->photoUrls);
        $uploadedPhotos = array_map(
            static fn ($barbershopPhoto) => BarbershopPhotoResponse::fromEntity($barbershopPhoto),
            $barbershopPhotos
        );

        return new AddBarbershopPhotosResponse(uploaded: $uploadedPhotos);
    }

    public function deleteBarbershopPhoto(int $barbershopId, int $photoId): bool
    {
        $this->validateBarbershopExists($barbershopId);
        return $this->barbershopRepository->deletePhoto($barbershopId, $photoId);
    }

    public function getReviews(int $barbershopId): array
    {
        $this->validateBarbershopExists($barbershopId);
        $barbershopReviews = $this->barbershopRepository->getReviews($barbershopId);

        return array_map(
            static fn ($barbershopReview) => BarbershopReviewResponse::fromEntity($barbershopReview),
            $barbershopReviews
        );
    }

    public function addReview(int $barbershopId, CreateBarbershopReviewRequest $request): BarbershopReviewResponse
    {
        $this->validateBarbershopExists($barbershopId);

        $userId = $request->userId->value;
        $user = $this->userService->validateUserExists($userId);

        if ($user->role->value !== Role::Client->value) {
            throw new BarbershopException('Only clients can leave barbershop reviews', HttpStatus::Forbidden);
        }

        $barbershopReview = $this->barbershopRepository->addReview(
            $userId,
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
        $this->validateBarbershopExists($barbershopId);
        return $this->barbershopRepository->deleteReview($barbershopId, $reviewId);
    }
}
