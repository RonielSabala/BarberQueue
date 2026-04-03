<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\UserEntity;

class UserRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'users';
    protected const array UPDATABLE_FIELDS = [
        'role_id',
        'username',
        'email',
        'phone',
        'password_hash',
    ];

    private function userQuery(): string
    {
        return <<<'SQL'
            SELECT
                u.*,
                r.role_name as role
            FROM
                users u
                JOIN roles r ON u.role_id = r.id
        SQL;
    }

    public function getById(int $id): ?UserEntity
    {
        $sql = $this->userQuery() . <<<'SQL'
            WHERE
                u.id = ?
            LIMIT
                1
        SQL;

        return $this->fetchOne(UserEntity::class, $sql, [$id]);
    }

    public function getByEmail(string $email): ?UserEntity
    {
        $sql = $this->userQuery() . <<<'SQL'
            WHERE
                u.email = ?
            LIMIT
                1
        SQL;

        return $this->fetchOne(UserEntity::class, $sql, [$email]);
    }

    public function createUser(
        int $roleId,
        string $username,
        string $email,
        string $phone,
        string $passwordHash,
    ): int {
        return $this->insert([
            'role_id' => $roleId,
            'username' => $username,
            'email' => $email,
            'phone' => $phone,
            'password_hash' => $passwordHash,
        ]);
    }

    public function updatePassword(int $id, string $passwordHash): void
    {
        $this->update($id, ['password_hash' => $passwordHash]);
    }

    public function updateRole(int $id, int $roleId): void
    {
        $this->update($id, ['role_id' => $roleId]);
    }
}
