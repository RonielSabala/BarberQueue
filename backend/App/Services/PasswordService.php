<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Exceptions\PasswordException;

class PasswordService
{
    private const INVALID_PASSWORD_MSG = 'Current password is incorrect';
    private const SAME_PASSWORD_MSG = 'New password must differ from the current one';

    public function validateMatch(string $password, string $hash): void
    {
        if (!password_verify($password, $hash)) {
            throw new PasswordException(self::INVALID_PASSWORD_MSG, HttpStatus::UnprocessableEntity);
        }
    }

    public function validateDiffers(string $newPassword, string $currentHash): void
    {
        if (password_verify($newPassword, $currentHash)) {
            throw new PasswordException(self::SAME_PASSWORD_MSG, HttpStatus::UnprocessableEntity);
        }
    }

    public function hash(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }
}
