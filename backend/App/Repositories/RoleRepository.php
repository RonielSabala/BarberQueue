<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\RoleEntity;

final readonly class RoleRepository extends BaseRepository
{
    public function getByValue(string $roleName): ?RoleEntity
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
