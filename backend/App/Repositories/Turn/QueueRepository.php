<?php

declare(strict_types=1);

namespace App\Repositories\Turn;

use App\Domain\Queue\BarberSlotData;

final readonly class QueueRepository extends TurnRepository
{
    public function findActiveBarbershopForBarber(int $barberId): ?int
    {
        $sql = <<<'SQL'
            SELECT DISTINCT
                t.barbershop_id
            FROM
                turns t
            WHERE
                t.barber_id = ?
                AND t.finished_at IS NULL
            LIMIT
                1
        SQL;

        $row = $this->query($sql, [$barberId])->fetch();
        return $row ? (int) $row['barbershop_id'] : null;
    }

    public function getSingleBarberSlot(int $barbershopId, int $barberId): ?BarberSlotData
    {
        $barberSql = <<<'SQL'
            SELECT
                u.id AS barber_id,
                u.username AS barber_name,
                bs.current_status AS barber_status,
                bs.is_accepting,
                bst.avg_service_minutes
            FROM
                users u
                JOIN roles r ON r.id = u.role_id
                JOIN barber_status bs ON bs.barber_id = u.id
                JOIN barber_stats bst ON bst.barber_id = u.id
            WHERE
                u.id = ?
                AND r.role_name = 'barber'
                AND bs.current_status = 'active'
            LIMIT
                1
        SQL;

        $row = $this->query($barberSql, [$barberId])->fetch();
        if (!$row) {
            return null;
        }

        $turnsByBarberId = [];
        foreach ($this->getAll($barbershopId) as $turn) {
            if ($turn->barberId?->value === $barberId) {
                $turnsByBarberId[] = $turn;
            }
        }

        return BarberSlotData::fromDbRow($row, $turnsByBarberId);
    }
}
