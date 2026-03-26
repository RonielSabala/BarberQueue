<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Exceptions\PasswordException;

class PasswordService extends BaseService
{
    private function exception(string $message): PasswordException
    {
        return new PasswordException($message, HttpStatus::UnprocessableEntity);
    }

    public function validateMatch(string $password, string $hash): void
    {
        if (!password_verify($password, $hash)) {
            throw $this->exception('Current password is incorrect');
        }
    }

    public function validateDiffers(string $newPassword, string $currentHash): void
    {
        if (password_verify($newPassword, $currentHash)) {
            throw $this->exception('New password must differ from the current one');
        }
    }

    public function hash(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }
}
