<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\Barbershop;
use App\Domain\ValueObjects\Role;
use App\DTOs\Barbershops\Requests\{
    CreateBarbershopEmployeeRequest,
    CreateBarbershopPhotosRequest,
    CreateBarbershopRequest,
    CreateBarbershopReviewRequest
};
use App\DTOs\Barbershops\Responses\{
    BarbershopDetailResponse,
    BarbershopEmployeeResponse,
    BarbershopPhotoResponse,
    BarbershopResponse,
    BarbershopReviewResponse,
    CreateBarbershopEmployeeResponse,
    CreateBarbershopPhotosResponse,
    CreateBarbershopResponse,
    GetBarbershopPhotosResponse
};
use App\DTOs\BaseRequest;
use App\Exceptions\BarbershopException;
use App\Repositories\{BarbershopRepository, RoleRepository};

class BarbershopService extends BaseService
{
    public function __construct(
        private readonly UserService $userService,
        private readonly PasswordService $passwordService,
        private readonly RoleRepository $roleRepository,
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
        $barbershops = $this->barbershopRepository->getAll($search, $isOpen);
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
            throw new BarbershopException('Barbershop email already in use', HttpStatus::Conflict);
        }

        $barbershop = $this->barbershopRepository->create(
            barbershopName: $request->barbershopName->value,
            email: $email,
            phone: $request->phone->value,
            barbershopAddress: $request->barbershopAddress->value,
            photoUrl: $request->photoUrl->value,
            opensAt: $request->opensAt->value,
            closesAt: $request->closesAt->value,
            capacity: $request->capacity?->value ?? 1
        );

        if ($barbershop === null) {
            throw new \RuntimeException('Failed to save barbershop');
        }

        return CreateBarbershopResponse::fromEntity($barbershop);
    }

    public function get(int $barbershopId): BarbershopDetailResponse
    {
        $barbershop = $this->validateBarbershopExists($barbershopId);
        return BarbershopDetailResponse::fromEntity($barbershop);
    }

    public function updateFields(int $barbershopId, BaseRequest $request): void
    {
        $this->validateBarbershopExists($barbershopId);
        $fields = $this->validateFieldsToUpdate($request);
        $this->barbershopRepository->updateFields($barbershopId, $fields);
    }

    public function getPhotos(int $barbershopId): GetBarbershopPhotosResponse
    {
        $this->validateBarbershopExists($barbershopId);
        $barbershopPhotos = $this->barbershopRepository->getPhotos($barbershopId);
        $photos = array_map(
            static fn ($barbershopPhoto) => BarbershopPhotoResponse::fromEntity($barbershopPhoto),
            $barbershopPhotos
        );

        return new GetBarbershopPhotosResponse(photos: $photos);
    }

    public function addPhotos(int $barbershopId, CreateBarbershopPhotosRequest $request): CreateBarbershopPhotosResponse
    {
        $this->validateBarbershopExists($barbershopId);
        $barbershopPhotos = $this->barbershopRepository->addPhotos($barbershopId, $request->photoUrls);
        $uploadedPhotos = array_map(
            static fn ($barbershopPhoto) => BarbershopPhotoResponse::fromEntity($barbershopPhoto),
            $barbershopPhotos
        );

        return new CreateBarbershopPhotosResponse(uploaded: $uploadedPhotos);
    }

    public function deletePhoto(int $barbershopId, int $photoId): bool
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

    public function getEmployees(int $barbershopId): array
    {
        $this->validateBarbershopExists($barbershopId);
        $employees = $this->barbershopRepository->getEmployees($barbershopId);

        return array_map(
            static fn ($employee) => BarbershopEmployeeResponse::fromEntity($employee),
            $employees
        );
    }

    public function createEmployee(int $id, CreateBarbershopEmployeeRequest $request): CreateBarbershopEmployeeResponse
    {
        $email = $request->email->value;
        $this->validateBarbershopExists($id);
        $this->userService->validateInexistentUserEmail($email);

        $role = $this->roleRepository->findByValue($request->role->value);
        $username = $request->username->value;
        $phone = $request->phone->value;
        $passwordHash = $this->passwordService->hash($request->password->value);
        $startTime = $request->startTime->value;
        $endTime = $request->endTime->value;
        $workingDays = array_map(static fn ($day) => $day->value, $request->workingDays);

        $employeeId = $this->barbershopRepository->createAndAssignEmployee(
            $id,
            [
                'role_id' => $role->id->value,
                'username' => $username,
                'email' => $email,
                'phone' => $phone,
                'password_hash' => $passwordHash,
            ],
            [
                'start_time' => $startTime,
                'end_time' => $endTime,
            ],
            $workingDays
        );

        return new CreateBarbershopEmployeeResponse(
            id: $employeeId,
            username: $username,
            email: $email,
            role: $role->roleName->value
        );
    }

    public function deleteEmployeeAssignment(int $barbershopId, int $employeeId): bool
    {
        $this->validateBarbershopExists($barbershopId);
        return $this->barbershopRepository->deleteEmployeeAssignment($employeeId, $barbershopId);
    }
}
