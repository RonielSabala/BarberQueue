<?php

declare(strict_types=1);

namespace App\Repositories\Barbershop;

use App\Repositories\BaseRepository;
use App\Domain\Entities\Barbershop\{BarbershopDashboardEntity, BarbershopEntity};

class BarbershopRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'barbershops';
    protected const array UPDATABLE_FIELDS = [
        'barbershop_name',
        'email',
        'phone',
        'barbershop_address',
        'photo_url',
        'opens_at',
        'closes_at',
        'capacity',
        'is_active',
    ];

    private function barbershopQuery(): string
    {
        return <<<'SQL'
            SELECT
                b.*,
                ROUND(AVG(r.rating), 1) AS average_rating
            FROM
                barbershops b
                LEFT JOIN barbershop_reviews r ON r.barbershop_id = b.id
        SQL;
    }

    public function getById(int $id): ?BarbershopEntity
    {
        $sql = $this->barbershopQuery() . <<<'SQL'
            WHERE
                b.id = ?
            GROUP BY
                b.id
            LIMIT
                1
        SQL;

        return $this->fetchOne(BarbershopEntity::class, $sql, [$id]);
    }

    public function getByEmail(string $email): ?BarbershopEntity
    {
        $sql = $this->barbershopQuery() . <<<'SQL'
            WHERE
                b.email = ?
            GROUP BY
                b.id
            LIMIT
                1
        SQL;

        return $this->fetchOne(BarbershopEntity::class, $sql, [$email]);
    }

    /** @return BarbershopEntity[] */
    public function getAll(
        ?string $search = null,
        ?bool $isOpen = null,
        ?int $adminId = null
    ): array {
        $sql = $this->barbershopQuery() . <<<'SQL'
            WHERE
                b.is_active = 1
        SQL;

        $params = [];
        if ($search) {
            $sql .= ' AND b.barbershop_name LIKE :search';
            $params['search'] = "%{$search}%";
        }

        if ($isOpen === true) {
            $sql .= <<<'SQL'
                AND (
                    (opens_at < closes_at AND CURRENT_TIME() BETWEEN opens_at AND closes_at)
                    OR
                    (opens_at >= closes_at AND (CURRENT_TIME() >= opens_at OR CURRENT_TIME() <= closes_at))
                )
            SQL;
        } elseif ($isOpen === false) {
            $sql .= <<<'SQL'
                AND NOT (
                    (opens_at < closes_at AND CURRENT_TIME() BETWEEN opens_at AND closes_at)
                    OR
                    (opens_at >= closes_at AND (CURRENT_TIME() >= opens_at OR CURRENT_TIME() <= closes_at))
                )
            SQL;
        }

        if ($adminId !== null) {
            $sql .= ' AND b.admin_id = :admin_id';
            $params['admin_id'] = $adminId;
        }

        $sql .= ' GROUP BY b.id';
        return $this->fetchAll(BarbershopEntity::class, $sql, $params);
    }

    public function createBarbershop(
        int $adminId,
        string $barbershopName,
        string $email,
        string $phone,
        string $barbershopAddress,
        string $photoUrl,
        string $opensAt,
        string $closesAt,
        int $capacity
    ): ?BarbershopEntity {
        $id = $this->insert([
            'admin_id' => $adminId,
            'barbershop_name' => $barbershopName,
            'email' => $email,
            'phone' => $phone,
            'barbershop_address' => $barbershopAddress,
            'photo_url' => $photoUrl,
            'opens_at' => $opensAt,
            'closes_at' => $closesAt,
            'capacity' => $capacity,
        ]);

        return $this->getById($id);
    }

    public function getDashboard(int $barbershopId): ?BarbershopDashboardEntity
    {
        $sql = <<<'SQL'
            SELECT
                b.id,
                -- Clients today
                (
                    SELECT
                        COUNT(*)
                    FROM
                        turns t
                    WHERE
                        t.barbershop_id = b.id
                        AND t.finished_at IS NOT NULL
                        AND DATE(t.finished_at) = CURDATE()
                ) AS clients_today,
                -- Clients this week
                (
                    SELECT
                        COUNT(*)
                    FROM
                        turns t
                    WHERE
                        t.barbershop_id = b.id
                        AND t.finished_at IS NOT NULL
                        AND t.finished_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                ) AS clients_this_week,
                -- Clients this month
                (
                    SELECT
                        COUNT(*)
                    FROM
                        turns t
                    WHERE
                        t.barbershop_id = b.id
                        AND t.finished_at IS NOT NULL
                        AND YEAR(t.finished_at) = YEAR(NOW())
                        AND MONTH(t.finished_at) = MONTH(NOW())
                ) AS clients_this_month,
                -- Average service duration in minutes
                (
                    SELECT
                        ROUND(AVG(TIMESTAMPDIFF(SECOND, t.attended_at, t.finished_at) / 60.0), 1)
                    FROM
                        turns t
                    WHERE
                        t.barbershop_id = b.id
                        AND t.finished_at IS NOT NULL
                        AND t.attended_at IS NOT NULL
                ) AS average_service_minutes,
                -- Average rating
                (
                    SELECT
                        ROUND(AVG(br.rating), 1)
                    FROM
                        barbershop_reviews br
                    WHERE
                        br.barbershop_id = b.id
                ) AS average_rating,
                -- Total reviews
                (
                    SELECT
                        COUNT(*)
                    FROM
                        barbershop_reviews br
                    WHERE
                        br.barbershop_id = b.id
                ) AS total_reviews,
                -- Active barbers right now
                (
                    SELECT
                        COUNT(DISTINCT sa.staff_id)
                    FROM
                        staff_assignments sa
                        JOIN barber_status bs ON bs.staff_id = sa.staff_id
                    WHERE
                        sa.barbershop_id = b.id
                        AND bs.current_status = 'active'
                ) AS active_barbers,
                -- Current queue depth
                (
                    SELECT
                        COUNT(*)
                    FROM
                        turns t
                    WHERE
                        t.barbershop_id = b.id
                        AND t.attended_at IS NULL
                ) AS queue_count
            FROM
                barbershops b
            WHERE
                b.id = ?
            LIMIT
                1
        SQL;

        return $this->fetchOne(BarbershopDashboardEntity::class, $sql, [$barbershopId]);
    }
}
