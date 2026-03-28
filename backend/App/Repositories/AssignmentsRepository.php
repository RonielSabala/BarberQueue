<?php

declare(strict_types=1);

namespace App\Repositories;

class AssignmentsRepository extends BaseRepository
{
    public function exists(int $staffId, int $barbershopId): bool
    {
        $sql = <<<'SQL'
            SELECT
                r.*
            FROM
                staff_assignments r
            WHERE
                staff_id = ?
                AND barbershop_id = ?
        SQL;

        $stmt = $this->query($sql, [$staffId, $barbershopId]);
        return (bool) $stmt->fetch();
    }
}
