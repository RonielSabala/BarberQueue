<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\User;
use App\DTOs\Auth\RegisterRequest;

class UserRepository extends BaseRepository
{
    public function findById(int $id): ?User
    {
        $sql = <<<'SQL'
        SELECT
            u.*,
            r.role_name as role
        FROM
            users u
            JOIN roles r ON u.role_id = r.id
        WHERE
            u.id = ?
        LIMIT
            1
        SQL;

        return $this->fetchOne(User::class, $sql, [$id]);
    }

    public function findByEmail(string $email): ?User
    {
        $sql = <<<'SQL'
        SELECT
            u.*,
            r.role_name as role
        FROM
            users u
            JOIN roles r ON u.role_id = r.id
        WHERE
            u.email = ?
        LIMIT
            1
        SQL;

        return $this->fetchOne(User::class, $sql, [$email]);
    }

    public function create(RegisterRequest $registerRequest): User
    {
        $sql = <<<'SQL'
        INSERT INTO
            users (role_id, username, email, phone, password_hash)
        VALUES
            (?, ?, ?, ?, ?)
        SQL;

        $this->query(
            $sql,
            [
                $registerRequest->roleId->value,
                $registerRequest->username->value,
                $registerRequest->email->value,
                $registerRequest->phone->value,
                $registerRequest->passwordHash->value,
            ]
        );

        $userId = (int) $this->db->lastInsertId();
        return $this->findById($userId);
    }

    public function updatePassword(int $id, string $passwordHash): void
    {
        $sql = <<<'SQL'
        UPDATE users
        SET
            password_hash = ?
        WHERE
            id = ?
        SQL;

        $this->query($sql, [$passwordHash, $id]);
    }
}
