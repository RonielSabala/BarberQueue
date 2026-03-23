<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\{GET, PATCH, RoutePrefix};
use App\Core\HttpResponse;
use App\DTOs\Users\Requests\{UpdateUserPasswordRequest, UpdateUserRequest};
use App\Services\UserService;

#[RoutePrefix('/api/users')]
class UserController extends BaseController
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    #[GET('/{id}')]
    public function getUser(int $id): void
    {
        $response = $this->userService->getUser($id);
        HttpResponse::json($response);
    }

    #[PATCH('/{id}')]
    public function updateUser(int $id, UpdateUserRequest $request): void
    {
        $this->userService->updateUser($id, $request);
        HttpResponse::success('User updated');
    }

    #[PATCH('/{id}/password')]
    public function updateUserPassword(int $id, UpdateUserPasswordRequest $request): void
    {
        $this->userService->updateUserPassword($id, $request);
        HttpResponse::success('Password updated');
    }
}
