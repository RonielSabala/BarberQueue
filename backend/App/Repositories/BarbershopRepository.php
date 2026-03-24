<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\Barbershop;

class BarbershopRepository extends BaseRepository
{
    public function findAll(?string $search = null, ?bool $isOpen = null): array
    {
        $sql = <<<'SQL'
            SELECT
                b.*,
                ROUND(AVG(r.rating), 1) AS average_rating
            FROM
                barbershops b
                LEFT JOIN barbershop_reviews r ON r.barbershop_id = b.id
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

        $sql .= ' GROUP BY b.id';
        return $this->fetchAll(Barbershop::class, $sql, $params);
    }
}
