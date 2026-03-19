<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\User;
use App\Domain\ValueObjects\{Id, PasswordHash};
use App\DTOs\Auth\{ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest};
use App\Exceptions\AuthException;
use App\Repositories\{PasswordResetRepository, UserRepository};
use Firebase\JWT\JWT;

class AuthService
{
    private const JWT_ALGORITHM = 'HS256';
    private const JWT_TOKEN_EXPIRY_HOURS = 24;
    private const CLIENT_ROLE_ID = 1;
    private readonly string $jwtSecret;

    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly PasswordResetRepository $passwordResetRepository,
        private readonly MailService $mailService,
    ) {
        $jwtSecret = $_ENV['JWT_SECRET'] ?? null;
        if (!$jwtSecret) {
            throw new AuthException('`JWT_SECRET` is not defined in the environment.', HttpStatus::InternalServerError);
        }

        $this->jwtSecret = $jwtSecret;
    }

    private function generateJwt(User $user): string
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

    public function login(LoginRequest $loginRequest): array
    {
        $user = $this->userRepository->findByEmail($loginRequest->email->value);
        $password = $loginRequest->password->value;
        $passwordHash = $user->passwordHash->value;

        if ($user === null || !password_verify($password, $passwordHash)) {
            throw new AuthException('Invalid credentials', HttpStatus::Unauthorized);
        }

        return [
            'token' => $this->generateJwt($user),
            'user' => $user,
        ];
    }

    public function register(RegisterRequest $registerRequest): User
    {
        $email = $registerRequest->email->value;
        $existing = $this->userRepository->findByEmail($email);

        if ($existing !== null) {
            throw new AuthException('Email already in use', HttpStatus::Conflict);
        }

        $password = $registerRequest->password->value;
        $registerRequest->roleId = new Id(self::CLIENT_ROLE_ID);
        $registerRequest->passwordHash = new PasswordHash(password_hash($password, PASSWORD_BCRYPT));

        return $this->userRepository->create($registerRequest);
    }

    public function forgotPassword(ForgotPasswordRequest $forgotPasswordRequest): void
    {
        $email = $forgotPasswordRequest->email->value;
        $user = $this->userRepository->findByEmail($email);

        if ($user === null) {
            return;
        }

        $this->mailService->sendPasswordReset($user);
    }

    public function resetPassword(ResetPasswordRequest $resetPasswordRequest): void
    {
        $resetCode = $resetPasswordRequest->resetCode->value;
        $passwordReset = $this->passwordResetRepository->findResetCode($resetCode);

        if ($passwordReset === null) {
            throw new AuthException('Invalid or expired reset code', HttpStatus::BadRequest);
        }

        $userId = $passwordReset->userId->value;
        $passwordResetId = $passwordReset->id->value;
        $newPassword = $resetPasswordRequest->password->value;
        $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);

        $this->userRepository->updatePassword($userId, $newPasswordHash);
        $this->passwordResetRepository->markAsUsed($passwordResetId);
    }
}
