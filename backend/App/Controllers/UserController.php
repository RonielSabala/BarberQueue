<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HttpResponse;
use App\Services\UserService;
use App\Attributes\{GET, PATCH, RoutePrefix};
use App\DTOs\Users\Requests\{UpdateUserPasswordRequest, UpdateUserRequest};

#[RoutePrefix('/api/users')]
class UserController extends BaseController
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    #[GET('')]
    public function getAll(
        ?string $username = null,
        ?string $email = null,
        ?string $role = null
    ): void {
        $response = $this->userService->getAll($username, $email, $role);
        HttpResponse::json($response);
    }

    #[GET('/{id}')]
    public function get(int $id): void
    {
        $response = $this->userService->get($id);
        HttpResponse::json($response);
    }

    #[PATCH('/{id}')]
    public function update(int $id, UpdateUserRequest $request): void
    {
        $this->userService->update($id, $request);
        HttpResponse::success('User updated');
    }

    #[PATCH('/{id}/password')]
    public function updatePassword(int $id, UpdateUserPasswordRequest $request): void
    {
        $this->userService->updatePassword($id, $request);
        HttpResponse::success('Password updated');
    }
}
