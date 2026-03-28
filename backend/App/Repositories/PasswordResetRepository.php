<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\PasswordReset;

class PasswordResetRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'password_resets';
    protected const array UPDATABLE_FIELDS = ['used'];

    public function getByValue(int $resetCodeValue): ?PasswordReset
    {
        $sql = <<<'SQL'
            SELECT
                *
            FROM
                password_resets
            WHERE
                reset_code = ?
                AND used = FALSE
                AND expires_at > NOW()
            LIMIT
                1
        SQL;

        return $this->fetchOne(PasswordReset::class, $sql, [$resetCodeValue]);
    }

    public function createPasswordReset(int $userId, int $resetCode, \DateTimeImmutable $expiresAt): void
    {
        $this->deleteFrom(self::TABLE_NAME, ['user_id' => $userId]);
        $this->insert([
            'user_id' => $userId,
            'reset_code' => $resetCode,
            'expires_at' => $expiresAt->format('Y-m-d H:i:s'),
        ]);
    }

    public function markAsUsed(int $id): void
    {
        $this->update($id, ['used' => true]);
    }
}
