<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\EmployeeAssignmentEntity;

class AssignmentRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'staff_assignments';
    protected const array UPDATABLE_FIELDS = [
        'start_time',
        'end_time',
    ];

    public function exists(int $staffId, int $barbershopId): bool
    {
        $sql = <<<'SQL'
            SELECT
                1
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

        return $this->fetchAll(EmployeeAssignmentEntity::class, $assignmentSql, [$id]);
    }

    public function createAssignment(
        int $staffId,
        int $barbershopId,
        string $startTime,
        string $endTime
    ): void {
        $this->insert([
            'staff_id' => $staffId,
            'barbershop_id' => $barbershopId,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);
    }

    public function updateAssignment(int $staffId, int $barbershopId, array $fields): void
    {
        $this->updateFrom(
            self::TABLE_NAME,
            $fields,
            [
                'staff_id' => $staffId,
                'barbershop_id' => $barbershopId,
            ]
        );
    }

    public function deleteAssignment(int $staffId, int $barbershopId): bool
    {
        return $this->deleteFrom(
            self::TABLE_NAME,
            [
                'staff_id' => $staffId,
                'barbershop_id' => $barbershopId,
            ]
        );
    }
}
