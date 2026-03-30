<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\UserEntity;
use App\DTOs\Auth\Requests\{
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest
};
use App\DTOs\Auth\Responses\{LoginResponse, UserResponse};
use App\Exceptions\AuthException;
use App\Repositories\{PasswordResetRepository, UserRepository};
use Firebase\JWT\JWT;

class AuthService extends BaseService
{
    private const JWT_ALGORITHM = 'HS256';
    private const JWT_TOKEN_EXPIRY_HOURS = 24;
    private const CLIENT_ROLE_ID = 1;

    private readonly string $jwtSecret;

    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly PasswordResetRepository $passwordResetRepository,
        private readonly PasswordService $passwordService,
        private readonly MailerInterface $mailService,
        private readonly UserService $userService,
    ) {
        $this->jwtSecret = $this->getEnvVariable('JWT_SECRET');
    }

    private function generateJwt(UserEntity $user): string
    {
        $now = time();
        $payload = [
            'iat' => $now,
            'exp' => $now + (self::JWT_TOKEN_EXPIRY_HOURS * 3600),
            'sub' => $user->id,
            'role' => $user->role,
        ];

        return JWT::encode($payload, $this->jwtSecret, self::JWT_ALGORITHM);
    }

    public function login(LoginRequest $request): LoginResponse
    {
        $user = $this->userRepository->getByEmail($request->email->value);
        if ($user === null || !password_verify(
            $request->password->value,
            $user->passwordHash->value
        )) {
            throw new AuthException('Invalid credentials', HttpStatus::Unauthorized);
        }

        return new LoginResponse(
            token: $this->generateJwt($user),
            user: UserResponse::fromEntity($user),
        );
    }

    public function register(RegisterRequest $request): UserResponse
    {
        $email = $request->email->value;
        $this->userService->validateInexistentUserEmail($email);

        $userId = $this->userRepository->createUser(
            roleId: self::CLIENT_ROLE_ID,
            username: $request->username->value,
            email: $email,
            phone: $request->phone->value,
            passwordHash: $this->passwordService->hash($request->password->value),
        );

        $user = $this->userRepository->getById($userId);
        if ($user === null) {
            throw new \RuntimeException('Failed to save user');
        }

        return UserResponse::fromEntity($user);
    }

    public function forgotPassword(ForgotPasswordRequest $request): void
    {
        $email = $request->email->value;
        $user = $this->userRepository->getByEmail($email);
        if ($user === null) {
            return;
        }

        $this->mailService->sendPasswordReset($user);
    }

    public function resetPassword(ResetPasswordRequest $request): void
    {
        $resetCode = $request->resetCode->value;
        $passwordReset = $this->passwordResetRepository->getByValue($resetCode);

        if ($passwordReset === null) {
            throw new AuthException('Invalid or expired code', HttpStatus::BadRequest);
        }

        $userId = $passwordReset->userId->value;
        $user = $this->userService->validateUserExists($userId);

        $this->userService->updateUserPassword($userId, $request->newPassword->value, $user->passwordHash->value);
        $this->passwordResetRepository->markAsUsed($passwordReset->id->value);
    }
}
