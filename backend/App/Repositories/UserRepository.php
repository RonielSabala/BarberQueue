<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\User;
use App\Domain\ValueObjects\{Email, Id, PasswordHash, Phone, Username};

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

    public function create(
        Username $username,
        Email $email,
        Phone $phone,
        PasswordHash $passwordHash,
        Id $roleId,
    ): User {
        $sql = <<<'SQL'
        INSERT INTO
            users (role_id, username, email, phone, password_hash)
        VALUES
            (?, ?, ?, ?, ?)
        SQL;

        $this->query(
            $sql,
            [
                $roleId->value,
                $username->value,
                $email->value,
                $phone->value,
                $passwordHash->value,
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
