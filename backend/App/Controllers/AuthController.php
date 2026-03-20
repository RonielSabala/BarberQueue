<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\POST;
use App\Core\{HttpResponse, HttpStatus};
use App\DTOs\Auth\Requests\{ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest};
use App\Services\AuthService;

class AuthController extends BaseController
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    #[POST('/api/auth/login')]
    public function login(): void
    {
        $request = $this->mapToRequest(LoginRequest::class);
        $response = $this->authService->login($request);
        HttpResponse::json($response);
    }

    #[POST('/api/auth/register')]
    public function register(): void
    {
        $request = $this->mapToRequest(RegisterRequest::class);
        $response = $this->authService->register($request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[POST('/api/auth/forgot-password')]
    public function forgotPassword(): void
    {
        $request = $this->mapToRequest(ForgotPasswordRequest::class);
        $this->authService->forgotPassword($request);
        HttpResponse::success('Recovery email sent');
    }

    #[POST('/api/auth/reset-password')]
    public function resetPassword(): void
    {
        $request = $this->mapToRequest(ResetPasswordRequest::class);
        $this->authService->resetPassword($request);
        HttpResponse::success('Password updated');
    }
}
