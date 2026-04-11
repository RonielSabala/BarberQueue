<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\DTOs\Auth\Requests\RegisterRequest;
use App\DTOs\Google\Responses\GoogleUrlResponse;
use App\Exceptions\AuthException;
use App\Repositories\UserRepository;
use App\Utils\EnvUtils;
use App\Domain\ValueObjects\{Email, Password, Phone, Username};
use App\DTOs\Auth\Responses\{LoginResponse, UserResponse};
use Google\{Service\Oauth2, Client};

final readonly class GoogleService extends BaseService
{
    private const API_ROUTE = '/api/auth/google';
    private const DEFAULT_PHONE_ON_REGISTER = '0000000000';

    private Client $googleClient;

    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly AuthService $authService,
    ) {
        $this->googleClient = new Client();
        $this->googleClient->setClientId(EnvUtils::get('GOOGLE_CLIENT_ID'));
        $this->googleClient->setClientSecret(EnvUtils::get('GOOGLE_CLIENT_SECRET'));
        $this->googleClient->setRedirectUri(EnvUtils::get('BACKEND_URL') . self::API_ROUTE);
        $this->googleClient->addScope('email');
        $this->googleClient->addScope('profile');
    }

    public function getGoogleUrl(): GoogleUrlResponse
    {
        return new GoogleUrlResponse(url: $this->googleClient->createAuthUrl());
    }

    public function loginWithGoogle(string $code): LoginResponse
    {
        // Validate token
        $token = $this->googleClient->fetchAccessTokenWithAuthCode($code);
        if (isset($token['error'])) {
            throw new AuthException('Error authenticating with Google', HttpStatus::UnprocessableEntity);
        }

        $this->googleClient->setAccessToken($token['access_token']);
        $userData = new Oauth2($this->googleClient)->userinfo->get();

        $email = $userData['email'];
        $user = $this->userRepository->getByEmail($email);

        if ($user === null) {
            $username = trim($userData['givenName'] . ' ' . $userData['familyName']);
            $randomPassword = bin2hex(random_bytes(16));

            $request = new RegisterRequest(
                username: new Username($username),
                email: new Email($email),
                phone: new Phone(self::DEFAULT_PHONE_ON_REGISTER),
                password: new Password($randomPassword),
            );

            $this->authService->register($request);
            $user = $this->userRepository->getByEmail($email);
        }

        return new LoginResponse(
            token: $this->authService->generateJwt($user),
            user: UserResponse::fromEntity($user),
        );
    }
}
