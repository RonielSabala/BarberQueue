<?php

declare(strict_types=1);

namespace App\Repositories;

final readonly class WorkingDayRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'working_days';

    /** @param int[] $days */
    public function createWorkingDays(int $staffId, int $barbershopId, array $days): void
    {
        foreach ($days as $day) {
            $this->insert([
                'staff_id' => $staffId,
                'barbershop_id' => $barbershopId,
                'day_of_week' => $day,
            ]);
        }
    }

    public function deleteWorkingDays(int $staffId, int $barbershopId): bool
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
