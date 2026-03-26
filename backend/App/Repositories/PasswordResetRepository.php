<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\PasswordReset;

class PasswordResetRepository extends BaseRepository
{
    public function findResetCode(int $resetCode): ?PasswordReset
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

        return $this->fetchOne(PasswordReset::class, $sql, [$resetCode]);
    }

    public function create(int $userId, int $resetCode, \DateTimeImmutable $expiresAt): void
    {
        $deleteSql = <<<'SQL'
        DELETE FROM password_resets
        WHERE
            user_id = ?
        SQL;

        $insertSql = <<<'SQL'
        INSERT INTO
            password_resets (user_id, reset_code, expires_at)
        VALUES
            (?, ?, ?)
        SQL;

        $this->query($deleteSql, [$userId]);
        $this->query($insertSql, [$userId, $resetCode, $expiresAt->format('Y-m-d H:i:s')]);
    }

    public function markAsUsed(int $id): void
    {
        $sql = <<<'SQL'
        UPDATE password_resets
        SET
            used = TRUE
        WHERE
            id = ?
        SQL;

        $this->query($sql, [$id]);
    }
}
