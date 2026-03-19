<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\PasswordReset;

class PasswordResetRepository extends BaseRepository
{
    public function findValidToken(string $token): ?PasswordReset
    {
        $sql = <<<'SQL'
        SELECT
            *
        FROM
            password_resets
        WHERE
            token = ?
            AND used = FALSE
            AND expires_at > NOW()
        LIMIT
            1
        SQL;

        return $this->fetchOne(PasswordReset::class, $sql, [$token]);
    }

    public function create(int $userId, string $token, \DateTimeImmutable $expiresAt): void
    {
        $deleteSql = <<<'SQL'
        DELETE FROM password_resets
        WHERE
            user_id = ?
        SQL;

        $insertSql = <<<'SQL'
        INSERT INTO
            password_resets (user_id, token, expires_at)
        VALUES
            (?, ?, ?)
        SQL;

        $this->query($deleteSql, [$userId]);
        $this->query($insertSql, [$userId, $token, $expiresAt->format('Y-m-d H:i:s')]);
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
