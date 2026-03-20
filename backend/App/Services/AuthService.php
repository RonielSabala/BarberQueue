<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\{Container, HttpStatus};
use App\Domain\Entities\User;
use App\Domain\ValueObjects\{Id, PasswordHash};
use App\DTOs\Auth\Requests\{ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest};
use App\DTOs\Auth\Responses\{LoginResponse, UserResponse};
use App\Exceptions\AuthException;
use App\Repositories\{PasswordResetRepository, UserRepository};
use Firebase\JWT\JWT;

class AuthService
{
    private const JWT_ALGORITHM = 'HS256';
    private const JWT_TOKEN_EXPIRY_HOURS = 24;
    private const CLIENT_ROLE_ID = 1;
    private readonly string $jwtSecret;
    private ?MailService $mailService;

    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly PasswordResetRepository $passwordResetRepository,
        private readonly Container $container,
    ) {
        $jwtSecret = $_ENV['JWT_SECRET'] ?? null;
        if (!$jwtSecret) {
            throw new AuthException('`JWT_SECRET` is not defined in the environment.', HttpStatus::InternalServerError);
        }

        $this->mailService = null;
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

    public function login(LoginRequest $request): LoginResponse
    {
        $user = $this->userRepository->findByEmail($request->email->value);
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
        $existing = $this->userRepository->findByEmail($email);

        if ($existing !== null) {
            throw new AuthException('Email already in use', HttpStatus::Conflict);
        }

        $passwordHash = new PasswordHash(password_hash($request->password->value, PASSWORD_BCRYPT));
        $user = $this->userRepository->create(
            username: $request->username,
            email: $request->email,
            phone: $request->phone,
            passwordHash: $passwordHash,
            roleId: new Id(self::CLIENT_ROLE_ID),
        );

        return UserResponse::fromEntity($user);
    }

    public function forgotPassword(ForgotPasswordRequest $request): void
    {
        $email = $request->email->value;
        $user = $this->userRepository->findByEmail($email);
        if ($user === null) {
            return;
        }

        if ($this->mailService === null) {
            $this->mailService = $this->container->make(MailService::class);
        }

        $this->mailService->sendPasswordReset($user);
    }

    public function resetPassword(ResetPasswordRequest $request): void
    {
        $resetCode = $request->resetCode->value;
        $passwordReset = $this->passwordResetRepository->findResetCode($resetCode);

        if ($passwordReset === null) {
            throw new AuthException('Invalid or expired code', HttpStatus::BadRequest);
        }

        $userId = $passwordReset->userId->value;

        $user = $this->userRepository->findById($passwordReset->userId->value);
        $oldPasswordHash = $user->passwordHash->value;
        $newPassword = $request->password->value;

        if (password_verify($newPassword, $oldPasswordHash)) {
            throw new AuthException('New password must be different from the current password', HttpStatus::UnprocessableEntity);
        }

        $passwordResetId = $passwordReset->id->value;
        $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);

        $this->userRepository->updatePassword($userId, $newPasswordHash);
        $this->passwordResetRepository->markAsUsed($passwordResetId);
    }
}
