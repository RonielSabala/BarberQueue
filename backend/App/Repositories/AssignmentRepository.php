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

    public function assignmentExists(int $staffId, int $barbershopId): bool
    {
        return $this->entityExists(
            'staff_assignments',
            [
                'staff_id' => $staffId,
                'barbershop_id' => $barbershopId,
            ]
        );
    }

    public function getBarbershopIdByStaffId(int $staffId): ?int
    {
        $sql = <<<'SQL'
            SELECT
                sa.barbershop_id
            FROM
                users u
                JOIN staff_assignments sa ON u.id = sa.staff_id
            WHERE
                u.id = ?
            LIMIT
                1
        SQL;

        $row = $this->query($sql, [$staffId])->fetch();
        return $row ? (int) $row['barbershop_id'] : null;
    }

    /** @return EmployeeAssignmentEntity[] */
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
