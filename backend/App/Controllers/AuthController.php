<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\{POST, RoutePrefix};
use App\Core\{HttpResponse, HttpStatus};
use App\DTOs\Auth\Requests\{ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest};
use App\Services\AuthService;

#[RoutePrefix('/api/auth')]
class AuthController extends BaseController
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    #[POST('/login')]
    public function login(LoginRequest $request): void
    {
        $response = $this->authService->login($request);
        HttpResponse::json($response);
    }

    #[POST('/register')]
    public function register(RegisterRequest $request): void
    {
        $response = $this->authService->register($request);
        HttpResponse::json($response, HttpStatus::Created);
    }

    #[POST('/forgot-password')]
    public function forgotPassword(ForgotPasswordRequest $request): void
    {
        $this->authService->forgotPassword($request);
        HttpResponse::success('Recovery email sent');
    }

    #[POST('/reset-password')]
    public function resetPassword(ResetPasswordRequest $request): void
    {
        $this->authService->resetPassword($request);
        HttpResponse::success('Password updated');
    }
}
