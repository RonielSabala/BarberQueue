<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\UserEntity;
use App\DTOs\Users\Responses\GetUserResponse;
use App\Exceptions\UserException;
use App\Repositories\UserRepository;
use App\DTOs\Users\Requests\{UpdateUserPasswordRequest, UpdateUserRequest};

class UserService extends BaseService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly PasswordService $passwordService,
    ) {}

    public function validateUserExists(int $userId): UserEntity
    {
        $user = $this->userRepository->getById($userId);
        if ($user === null) {
            throw new UserException('User not found', HttpStatus::NotFound);
        }

        return $user;
    }

    public function validateInexistentUserEmail(string $userEmail): void
    {
        $user = $this->userRepository->getByEmail($userEmail);
        if ($user) {
            throw new UserException('User email already in use', HttpStatus::Conflict);
        }
    }

    /** @return GetUserResponse[] */
    public function getAll(?string $username, ?string $email, ?string $role): array
    {
        $users = $this->userRepository->getAll($username, $email, $role);
        return GetUserResponse::fromEntities($users);
    }

    public function get(int $userId): GetUserResponse
    {
        $user = $this->validateUserExists($userId);
        return GetUserResponse::fromEntity($user);
    }

    public function update(int $userId, UpdateUserRequest $request): void
    {
        $this->validateUserExists($userId);
        $fields = $this->validateFieldsToUpdate($request);
        $this->userRepository->update($userId, $fields);
    }

    public function updatePassword(int $userId, UpdateUserPasswordRequest $request): void
    {
        $user = $this->validateUserExists($userId);

        $currentPassword = $request->currentPassword->value;
        $newPassword = $request->newPassword->value;
        $userPasswordHash = $user->passwordHash->value;

        $this->passwordService->validateMatch($currentPassword, $userPasswordHash);
        $this->updateUserPassword($userId, $newPassword, $userPasswordHash);
    }

    public function updateUserPassword(int $userId, string $newPassword, $userPasswordHash): void
    {
        $newPasswordHash = $this->passwordService->hash($newPassword);
        $this->passwordService->validateDiffers($newPassword, $userPasswordHash);
        $this->userRepository->updatePassword($userId, $newPasswordHash);
    }
}
