<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HttpResponse;
use App\Services\GoogleService;
use App\Utils\EnvUtils;
use App\Attributes\{GET, RoutePrefix};

#[RoutePrefix('/api/auth/google')]
final readonly class GoogleController extends BaseController
{
    private string $callbackUrl;

    public function __construct(
        private readonly GoogleService $googleService
    ) {
        $this->callbackUrl = EnvUtils::get('FRONTEND_URL') . '/auth/callback';
    }

    #[GET('/url')]
    public function getGoogleUrl(): void
    {
        $response = $this->googleService->getGoogleUrl();
        HttpResponse::json($response);
    }

    #[GET('')]
    public function loginWithGoogle(?string $code = null): void
    {
        if ($code === null) {
            header("Location: {$this->callbackUrl}?error=missing_code");
            exit;
        }

        try {
            $response = $this->googleService->loginWithGoogle($code);
            $params = http_build_query([
                'token' => $response->token,
                'id' => $response->user->id,
                'username' => $response->user->username,
                'role' => $response->user->role,
            ]);

            header("Location: {$this->callbackUrl}?{$params}");
        } catch (\Throwable) {
            header("Location: {$this->callbackUrl}?error=auth_failed");
        }

        exit;
    }
}
