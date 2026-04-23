<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Exceptions\PasswordException;

final readonly class PasswordService extends BaseService
{
    public function validateMatch(string $password, string $hash): void
    {
        if (!password_verify($password, $hash)) {
            throw new PasswordException(
                'Current password is incorrect',
                HttpStatus::UnprocessableEntity
            );
        }
    }

    public function validateDiffers(string $newPassword, string $currentHash): void
    {
        if (password_verify($newPassword, $currentHash)) {
            throw new PasswordException(
                'New password must differ from the current one',
                HttpStatus::UnprocessableEntity
            );
        }
    }

    public function hash(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }
}
