<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\BarbershopEntity;
use App\Domain\ValueObjects\Role;
use App\DTOs\Barbershops\Requests\{
    CreateBarbershopEmployeeRequest,
    CreateBarbershopPhotosRequest,
    CreateBarbershopRequest,
    CreateBarbershopReviewRequest
};
use App\DTOs\Barbershops\Responses\{
    BarbershopDashboardResponse,
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
use App\Repositories\{
    AssignmentRepository,
    BarbershopPhotoRepository,
    BarbershopRepository,
    BarbershopReviewRepository,
    EmployeeRepository,
    RoleRepository,
    UserRepository,
    WorkingDayRepository
};

class BarbershopService extends BaseService
{
    public function __construct(
        private readonly RoleRepository $roleRepository,
        private readonly WorkingDayRepository $workingDayRepository,
        private readonly AssignmentRepository $assignmentRepository,
        private readonly EmployeeRepository $employeeRepository,
        private readonly UserRepository $userRepository,
        private readonly BarbershopRepository $barbershopRepository,
        private readonly BarbershopPhotoRepository $barbershopPhotoRepository,
        private readonly BarbershopReviewRepository $barbershopReviewRepository,
        private readonly PasswordService $passwordService,
        private readonly UserService $userService,
    ) {}

    public function validateBarbershopExists(int $barbershopId): BarbershopEntity
    {
        $barbershop = $this->barbershopRepository->getById($barbershopId);
        if ($barbershop === null) {
            throw new BarbershopException('Barbershop not found', HttpStatus::NotFound);
        }

        return $barbershop;
    }

    /** @return BarbershopResponse[] */
    public function getAll(?string $search, ?bool $isOpen, ?int $adminId = null): array
    {
        $barbershops = $this->barbershopRepository->getAll($search, $isOpen, $adminId);
        return BarbershopResponse::fromEntities($barbershops);
    }

    public function create(CreateBarbershopRequest $request): CreateBarbershopResponse
    {
        // Validate admin
        $adminId = $request->adminId->value;
        $admin = $this->userService->validateUserExists($adminId);
        if ($admin->role->value !== Role::Admin->value) {
            throw new BarbershopException(
                'Only admins can own barbershops',
                HttpStatus::Forbidden
            );
        }

        $email = $request->email->value;
        $existing = $this->barbershopRepository->getByEmail($email);

        if ($existing !== null) {
            throw new BarbershopException('Barbershop email already in use', HttpStatus::Conflict);
        }

        $barbershop = $this->barbershopRepository->createBarbershop(
            adminId: $request->adminId->value,
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

    public function getDashboard(int $barbershopId): BarbershopDashboardResponse
    {
        $this->validateBarbershopExists($barbershopId);
        $dashboard = $this->barbershopRepository->getDashboard($barbershopId);
        return BarbershopDashboardResponse::fromEntity($dashboard);
    }

    public function update(int $barbershopId, BaseRequest $request): void
    {
        $this->validateBarbershopExists($barbershopId);
        $fields = $this->validateFieldsToUpdate($request);
        $this->barbershopRepository->update($barbershopId, $fields);
    }

    public function getPhotos(int $barbershopId): GetBarbershopPhotosResponse
    {
        $this->validateBarbershopExists($barbershopId);
        $barbershopPhotos = $this->barbershopPhotoRepository->getAll($barbershopId);
        $photos = BarbershopPhotoResponse::fromEntities($barbershopPhotos);
        return new GetBarbershopPhotosResponse(photos: $photos);
    }

    public function createPhotos(int $barbershopId, CreateBarbershopPhotosRequest $request): CreateBarbershopPhotosResponse
    {
        $this->validateBarbershopExists($barbershopId);
        $barbershopPhotos = $this->barbershopPhotoRepository->createPhotos($barbershopId, $request->photoUrls);
        $uploadedPhotos = BarbershopPhotoResponse::fromEntities($barbershopPhotos);
        return new CreateBarbershopPhotosResponse(uploaded: $uploadedPhotos);
    }

    public function deletePhoto(int $barbershopId, int $photoId): bool
    {
        $this->validateBarbershopExists($barbershopId);
        return $this->barbershopPhotoRepository->deletePhoto($barbershopId, $photoId);
    }

    /** @return BarbershopReviewResponse[] */
    public function getReviews(int $barbershopId): array
    {
        $this->validateBarbershopExists($barbershopId);
        $barbershopReviews = $this->barbershopReviewRepository->getAllByBarbershopId($barbershopId);
        return BarbershopReviewResponse::fromEntities($barbershopReviews);
    }

    public function createReview(int $barbershopId, CreateBarbershopReviewRequest $request): BarbershopReviewResponse
    {
        $this->validateBarbershopExists($barbershopId);

        $clientId = $request->clientId->value;
        $client = $this->userService->validateUserExists($clientId);

        if ($client->role->value !== Role::Client->value) {
            throw new BarbershopException('Only clients can leave barbershop reviews', HttpStatus::Forbidden);
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
        $this->validateBarbershopExists($barbershopId);
        return $this->barbershopReviewRepository->deleteReview($barbershopId, $reviewId);
    }

    /** @return BarbershopEmployeeResponse[] */
    public function getEmployees(int $barbershopId): array
    {
        $this->validateBarbershopExists($barbershopId);
        $employees = $this->employeeRepository->getAllByBarbershopId($barbershopId);
        return BarbershopEmployeeResponse::fromEntities($employees);
    }

    public function createEmployee(int $barbershopId, CreateBarbershopEmployeeRequest $request): CreateBarbershopEmployeeResponse
    {
        $this->validateBarbershopExists($barbershopId);
        $this->userService->validateInexistentUserEmail($request->email->value);

        $role = $this->roleRepository->getByValue($request->role->value);
        $roleName = $role->roleName->value;
        if ($roleName === Role::Client->value || $roleName === Role::Admin->value) {
            throw new BarbershopException(
                'Only barbers and assistants can be assigned to a barbershop',
                HttpStatus::UnprocessableEntity
            );
        }

        $employeeId = $this->barbershopRepository->transaction(function () use (
            $barbershopId,
            $request,
            $role,
        ) {
            $userId = $this->userRepository->createUser(
                $role->id->value,
                $request->username->value,
                $request->email->value,
                $request->phone->value,
                $this->passwordService->hash($request->password->value),
            );
            $this->assignmentRepository->createAssignment(
                $userId,
                $barbershopId,
                $request->startTime->value,
                $request->endTime->value
            );
            $this->workingDayRepository->createWorkingDays(
                $userId,
                $barbershopId,
                array_map(static fn ($day) => $day->value, $request->workingDays)
            );

            return $userId;
        });

        return new CreateBarbershopEmployeeResponse(
            id: $employeeId,
            username: $request->username->value,
            email: $request->email->value,
            role: $roleName
        );
    }

    public function deleteEmployeeAssignment(int $barbershopId, int $employeeId): bool
    {
        $this->validateBarbershopExists($barbershopId);
        return $this->assignmentRepository->deleteAssignment($employeeId, $barbershopId);
    }
}
