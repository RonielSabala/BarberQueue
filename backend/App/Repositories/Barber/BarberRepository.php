<?php

declare(strict_types=1);

namespace App\Repositories\Barber;

use App\Repositories\BaseRepository;
use App\Domain\Entities\Barber\{BarberDashboardEntity, BarberEntity};

final readonly class BarberRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'barber_status';
    protected const array UPDATABLE_FIELDS = [
        'current_status',
        'is_accepting',
    ];

    public function getById(int $barberId): ?BarberEntity
    {
        $sql = <<<'SQL'
            SELECT
                u.id,
                u.username,
                bs.current_status,
                bs.is_accepting
            FROM
                users u
                JOIN barber_status bs ON u.id = bs.staff_id
            WHERE
                u.id = ?
            LIMIT
                1
        SQL;

        return $this->fetchOne(BarberEntity::class, $sql, [$barberId]);
    }

    public function getDashboard(int $barberId): ?BarberDashboardEntity
    {
        $sql = <<<'SQL'
            SELECT
                COUNT(
                    CASE
                        WHEN t.finished_at IS NOT NULL THEN 1
                    END
                ) AS total_attended_clients,
                SEC_TO_TIME(
                    CAST(
                        ROUND(
                            AVG(
                                CASE
                                    WHEN t.finished_at IS NOT NULL
                                    AND t.attended_at IS NOT NULL THEN TIMESTAMPDIFF(SECOND, t.attended_at, t.finished_at)
                                END
                            ),
                            1
                        ) AS SIGNED
                    )
                ) AS average_time_with_clients,
                ROUND(AVG(br.rating), 1) AS average_rating,
                u.created_at AS join_date
            FROM
                users u
                LEFT JOIN turns t ON t.barber_id = u.id
                LEFT JOIN barber_reviews br ON br.barber_id = u.id
            WHERE
                u.id = ?
            GROUP BY
                u.id,
                u.created_at
            LIMIT
                1
        SQL;

        return $this->fetchOne(BarberDashboardEntity::class, $sql, [$barberId]);
    }

    public function updateStatus(int $barberId, array $fields): void
    {
        $this->updateFrom(self::TABLE_NAME, $fields, ['staff_id' => $barberId]);
    }
}
