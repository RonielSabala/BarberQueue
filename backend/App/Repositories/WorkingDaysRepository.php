<?php

declare(strict_types=1);

namespace App\Repositories;

class WorkingDaysRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'working_days';

    public function createDays(int $staffId, int $barbershopId, array $days): void
    {
        $daySql = <<<'SQL'
            INSERT INTO
                working_days (staff_id, barbershop_id, day_of_week)
            VALUES
                (?, ?, ?)
        SQL;

        foreach ($days as $day) {
            $this->query($daySql, [$staffId, $barbershopId, $day]);
        }
    }

    public function deleteDays(int $staffId, int $barbershopId): void
    {
        $this->deleteFrom(
            self::TABLE_NAME,
            [
                'staff_id' => $staffId,
                'barbershop_id' => $barbershopId,
            ]
        );
    }
}
