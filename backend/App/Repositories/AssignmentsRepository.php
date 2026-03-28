<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\EmployeeAssignment;

class AssignmentsRepository extends BaseRepository
{
    public function exists(int $staffId, int $barbershopId): bool
    {
        $sql = <<<'SQL'
            SELECT
                sa.*
            FROM
                staff_assignments sa
            WHERE
                staff_id = ?
                AND barbershop_id = ?
        SQL;

        $stmt = $this->query($sql, [$staffId, $barbershopId]);
        return (bool) $stmt->fetch();
    }

    public function getAllByStaffId(int $id): ?array
    {
        $assignmentSql = <<<'SQL'
            SELECT
                sa.barbershop_id,
                sa.start_time,
                sa.end_time,
                GROUP_CONCAT(
                    wd.day_of_week
                    ORDER BY
                        wd.day_of_week ASC
                ) AS working_days
            FROM
                staff_assignments sa
                LEFT JOIN working_days wd ON wd.staff_id = sa.staff_id
                AND wd.barbershop_id = sa.barbershop_id
            WHERE
                sa.staff_id = ?
            GROUP BY
                sa.barbershop_id,
                sa.start_time,
                sa.end_time
        SQL;

        return $this->fetchAll(EmployeeAssignment::class, $assignmentSql, [$id]);
    }
}
