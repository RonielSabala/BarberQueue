<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HttpResponse;
use App\Services\GoogleService;
use App\Attributes\{GET, RoutePrefix};

#[RoutePrefix('/api/auth/google')]
final readonly class GoogleController extends BaseController
{
    public function __construct(
        private readonly GoogleService $googleService
    ) {}

    #[GET('/url')]
    public function getGoogleUrl(): void
    {
        $response = $this->googleService->getGoogleUrl();
        HttpResponse::json($response);
    }

    #[GET('')]
    public function loginWithGoogle(?string $code = null): void
    {
        $response = $this->googleService->loginWithGoogle($code);
        HttpResponse::json($response);
    }
}
