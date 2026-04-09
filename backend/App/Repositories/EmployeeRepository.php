<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\Barbershop\BarbershopEmployeeEntity;

final readonly class EmployeeRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'users';

    /** @return BarbershopEmployeeEntity[] */
    public function getAllByBarbershopId(int $barbershopId): array
    {
        $sql = <<<'SQL'
            SELECT
                u.id,
                sa.barbershop_id,
                u.username,
                u.email,
                u.phone,
                r.role_name AS role,
                sa.start_time AS start_time,
                sa.end_time AS end_time,
                GROUP_CONCAT(
                    wd.day_of_week
                    ORDER BY
                        wd.day_of_week ASC
                ) AS working_days
            FROM
                users u
                JOIN roles r ON u.role_id = r.id
                JOIN staff_assignments sa ON u.id = sa.staff_id
                LEFT JOIN working_days wd ON u.id = wd.staff_id
                AND wd.barbershop_id = sa.barbershop_id
            WHERE
                sa.barbershop_id = ?
            GROUP BY
                u.id,
                sa.barbershop_id,
                r.role_name,
                sa.start_time,
                sa.end_time
        SQL;

        return $this->fetchAll(BarbershopEmployeeEntity::class, $sql, [$barbershopId]);
    }
}
