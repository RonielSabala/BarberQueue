<?php

declare(strict_types=1);

namespace App\Repositories;

class EmployeeRepository extends BaseRepository
{
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
