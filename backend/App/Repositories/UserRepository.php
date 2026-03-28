<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\User;

class UserRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'users';
    protected const array UPDATABLE_FIELDS = [
        'username',
        'email',
        'phone',
        'password_hash',
    ];

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
        int $roleId,
        string $username,
        string $email,
        string $phone,
        string $passwordHash,
    ): ?User {
        $sql = <<<'SQL'
            INSERT INTO
                users (role_id, username, email, phone, password_hash)
            VALUES
                (?, ?, ?, ?, ?)
        SQL;

        $this->query(
            $sql,
            [
                $roleId,
                $username,
                $email,
                $phone,
                $passwordHash,
            ]
        );

        $id = (int) $this->db->lastInsertId();
        return $this->findById($id);
    }

    public function updatePassword(int $id, string $passwordHash): void
    {
        $this->update($id, ['password_hash' => $passwordHash]);
    }
}
