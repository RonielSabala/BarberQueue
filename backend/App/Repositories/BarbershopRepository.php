<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\{BarbershopDashboardEntity, BarbershopEntity};

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
            $sql .= ' AND (b.opens_at <= CURRENT_TIME() AND b.closes_at >= CURRENT_TIME())';
        } elseif ($isOpen === false) {
            $sql .= ' AND (b.opens_at > CURRENT_TIME() OR b.closes_at < CURRENT_TIME())';
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
                COUNT(
                    CASE
                        WHEN DATE(t.created_at) = CURDATE()
                        AND t.finished_at IS NOT NULL THEN 1
                    END
                ) AS clients_today,
                -- Clients this week
                COUNT(
                    CASE
                        WHEN t.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                        AND t.finished_at IS NOT NULL THEN 1
                    END
                ) AS clients_this_week,
                -- Clients this month
                COUNT(
                    CASE
                        WHEN YEAR(t.created_at) = YEAR(NOW())
                        AND MONTH(t.created_at) = MONTH(NOW())
                        AND t.finished_at IS NOT NULL THEN 1
                    END
                ) AS clients_this_month,
                -- Average service duration in minutes
                ROUND(
                    AVG(
                        CASE
                            WHEN t.finished_at IS NOT NULL
                            AND t.attended_at IS NOT NULL THEN TIMESTAMPDIFF(SECOND, t.attended_at, t.finished_at) / 60.0
                        END
                    ),
                    1
                ) AS average_service_minutes,
                -- Average rating from reviews
                ROUND(AVG(br.rating), 1) AS average_rating,
                -- Total reviews count
                COUNT(DISTINCT br.id) AS total_reviews,
                -- Active barbers right now
                COUNT(
                    DISTINCT CASE
                        WHEN bs.current_status = 'active' THEN sa.staff_id
                    END
                ) AS active_barbers,
                -- Current queue depth
                COUNT(
                    CASE
                        WHEN t.finished_at IS NULL THEN 1
                    END
                ) AS queue_count
            FROM
                barbershops b
                LEFT JOIN turns t ON t.barbershop_id = b.id
                LEFT JOIN barbershop_reviews br ON br.barbershop_id = b.id
                LEFT JOIN staff_assignments sa ON sa.barbershop_id = b.id
                LEFT JOIN barber_status bs ON bs.staff_id = sa.staff_id
            WHERE
                b.id = ?
            GROUP BY
                b.id
            LIMIT
                1
        SQL;

        return $this->fetchOne(BarbershopDashboardEntity::class, $sql, [$barbershopId]);
    }
}
