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
                JOIN barber_status bs ON u.id = bs.barber_id
            WHERE
                u.id = ?
            LIMIT
                1
        SQL;

        return $this->fetchOne(BarberEntity::class, $sql, [$barberId]);
    }

    public function getByAssignment(int $barberId, int $barbershopId): ?BarberEntity
    {
        $sql = <<<'SQL'
            SELECT
                u.id,
                u.username,
                bs.current_status,
                bs.is_accepting
            FROM
                users u
                JOIN barber_status bs ON u.id = bs.barber_id
                JOIN staff_assignments sa ON u.id = sa.staff_id
            WHERE
                u.id = ?
                AND sa.barbershop_id = ?
            LIMIT
                1
        SQL;

        return $this->fetchOne(BarberEntity::class, $sql, [$barberId, $barbershopId]);
    }

    public function getDashboard(int $barberId): ?BarberDashboardEntity
    {
        $sql = <<<'SQL'
            SELECT
                bst.total_attended AS total_attended_clients,
                bst.avg_service_minutes AS average_service_minutes,
                bst.avg_rating AS average_rating,
                u.created_at AS join_date
            FROM
                users u
                JOIN barber_stats bst ON bst.barber_id = u.id
            WHERE
                u.id = ?
            LIMIT
                1
        SQL;

        return $this->fetchOne(BarberDashboardEntity::class, $sql, [$barberId]);
    }

    public function updateStatus(int $barberId, array $fields): void
    {
        $this->updateFrom(self::TABLE_NAME, $fields, ['barber_id' => $barberId]);
    }
}
