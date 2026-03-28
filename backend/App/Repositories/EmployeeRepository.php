<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\{Employee, EmployeeAssignment};
use App\Domain\ValueObjects\{Email, Id, Phone, RoleName, TimeOfDay, Username};

class EmployeeRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'users';

    public function findById(int $id): ?Employee
    {
        $userSql = <<<'SQL'
            SELECT
                u.id,
                u.username,
                u.email,
                u.phone,
                r.role_name AS role
            FROM
                users u
                JOIN roles r ON u.role_id = r.id
            WHERE
                u.id = ?
            LIMIT
                1
        SQL;

        $user = $this->query($userSql, [$id])->fetch();
        if (!$user) {
            return null;
        }

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

        $assignmentRows = $this->query($assignmentSql, [$id])->fetchAll();
        $assignments = array_map(
            static fn (array $row) => new EmployeeAssignment(
                barbershopId: new Id($row['barbershop_id']),
                startTime: new TimeOfDay($row['start_time']),
                endTime: new TimeOfDay($row['end_time']),
                workingDays: $row['working_days']
                    ? array_map('intval', explode(',', $row['working_days']))
                    : [],
            ),
            $assignmentRows
        );

        return new Employee(
            id: new Id($user['id']),
            username: new Username($user['username']),
            email: new Email($user['email']),
            phone: new Phone($user['phone']),
            role: new RoleName($user['role']),
            assignments: $assignments,
        );
    }

    public function updateAssignment(int $staffId, int $barbershopId, array $fields, ?array $days): void
    {
        unset($fields['working_days']);

        $assignmentsSql = null;
        if (!empty($fields)) {
            $setClauses = implode(', ', array_map(
                static fn (string $field) => "{$field} = ?",
                array_keys($fields)
            ));

            $assignmentsSql = <<<SQL
                UPDATE staff_assignments
                SET
                    {$setClauses}
                WHERE
                    staff_id = ?
                    AND barbershop_id = ?
            SQL;
        }

        $deleteDaySql = <<<'SQL'
            DELETE FROM working_days
            WHERE
                staff_id = ?
                AND barbershop_id = ?
        SQL;

        $daySql = <<<'SQL'
            INSERT INTO
                working_days (staff_id, barbershop_id, day_of_week)
            VALUES
                (?, ?, ?)
        SQL;

        $this->transaction(function () use (
            $staffId,
            $barbershopId,
            $fields,
            $days,
            $daySql,
            $deleteDaySql,
            $assignmentsSql,
        ): void {
            if ($assignmentsSql !== null) {
                $this->query(
                    $assignmentsSql,
                    [
                        ...array_values($fields),
                        $staffId,
                        $barbershopId,
                    ]
                );
            }

            if ($days === null) {
                return;
            }

            $this->query($deleteDaySql, [$staffId, $barbershopId]);
            foreach ($days as $day) {
                $this->query($daySql, [$staffId, $barbershopId, $day]);
            }
        });
    }

    public function delete(int $id): bool
    {
        $sql = <<<'SQL'
            DELETE FROM users
            WHERE
                id = ?
        SQL;

        $stmt = $this->query($sql, [$id]);
        return $stmt->rowCount() > 0;
    }
}
