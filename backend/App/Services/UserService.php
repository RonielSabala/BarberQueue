<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\User;
use App\DTOs\Users\Requests\{UpdateUserPasswordRequest, UpdateUserRequest};
use App\DTOs\Users\Responses\GetUserResponse;
use App\Exceptions\UserException;
use App\Repositories\UserRepository;

class UserService extends BaseService
{
    public function __construct(
        private readonly PasswordService $passwordService,
        private readonly UserRepository $userRepository,
    ) {}

    private function validateUserExists(int $userId): User
    {
        $user = $this->userRepository->findById($userId);
        if ($user === null) {
            throw new UserException('User not found', HttpStatus::NotFound);
        }

        return $user;
    }

    public function getUser(int $userId): GetUserResponse
    {
        $user = $this->validateUserExists($userId);
        return GetUserResponse::fromEntity($user);
    }

    public function updateUser(int $userId, UpdateUserRequest $request): void
    {
        $this->validateUserExists($userId);

        $fields = array_filter([
            'username' => $request->username?->value,
            'email' => $request->email?->value,
            'phone' => $request->phone?->value,
        ], static fn (mixed $value) => $value !== null);

        if (empty($fields)) {
            throw new UserException('At least one field must be provided', HttpStatus::BadRequest);
        }

        $this->userRepository->updateFields($userId, $fields);
    }

    public function updateUserPassword(int $userId, UpdateUserPasswordRequest $request): void
    {
        $user = $this->validateUserExists($userId);

        $currentPassword = $request->currentPassword->value;
        $newPassword = $request->newPassword->value;
        $userPasswordHash = $user->passwordHash->value;

        $this->passwordService->validateMatch($currentPassword, $userPasswordHash);
        $this->passwordService->validateDiffers($newPassword, $userPasswordHash);
        $this->userRepository->updatePassword($userId, $this->passwordService->hash($newPassword));
    }
}
