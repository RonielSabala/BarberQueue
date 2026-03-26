<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\RoleEntity;

class RoleRepository extends BaseRepository
{
    public function findByValue(string $roleName): ?RoleEntity
    {
        $sql = <<<'SQL'
            SELECT
                r.*
            FROM
                roles r
            WHERE
                r.role_name = ?
        SQL;

        return $this->fetchOne(RoleEntity::class, $sql, [$roleName]);
    }
}
