<?php

declare(strict_types=1);

namespace App\Repositories\Turn;

use App\Domain\Entities\Turn\TurnEntity;
use App\Domain\Queue\BarberSlotData;
use App\Repositories\BaseRepository;

class TurnRepository extends BaseRepository
{
    /** @return TurnEntity[] */
    public function getAll(int $barbershopId, ?int $barberId = null): array
    {
        $sql = <<<'SQL'
            SELECT
                t.id,
                t.barber_id,
                t.group_id,
                t.created_at,
                CASE
                    WHEN t.client_id IS NOT NULL THEN 'client'
                    ELSE 'member'
                END AS owner_type,
                CASE
                    WHEN t.client_id IS NOT NULL THEN t.client_id
                    ELSE t.member_id
                END AS owner_id,
                CASE
                    WHEN t.client_id IS NOT NULL THEN u.username
                    ELSE gm.member_name
                END AS owner_name,
                CASE
                    WHEN t.client_id IS NOT NULL THEN cs.current_status
                    ELSE gm.current_status
                END AS owner_status,
                CASE
                    WHEN t.group_id IS NOT NULL THEN (
                        SELECT
                            COUNT(*)
                        FROM
                            group_members gm2
                        WHERE
                            gm2.group_id = t.group_id
                    )
                    ELSE NULL
                END AS group_size
            FROM
                turns t
                LEFT JOIN users u ON u.id = t.client_id
                LEFT JOIN client_status cs ON cs.client_id = t.client_id
                LEFT JOIN group_members gm ON gm.id = t.member_id
            WHERE
                t.barbershop_id = ?
                AND t.finished_at IS NULL
        SQL;

        $params = [$barbershopId];
        if ($barberId !== null) {
            $sql .= ' AND t.barber_id = ?';
            $params[] = $barberId;
        }

        $sql .= <<<'SQL'
            ORDER BY
                t.barber_id ASC,
                t.created_at ASC
        SQL;

        return $this->fetchAll(TurnEntity::class, $sql, $params);
    }

    /** @return array{null|BarberSlotData[], null|TurnEntity[]} */
    public function getBarberSlots(int $barbershopId): array
    {
        $barberSql = <<<'SQL'
            SELECT
                u.id AS barber_id,
                u.username AS barber_name,
                bs.current_status AS barber_status,
                bs.is_accepting,
                ROUND(
                    AVG(
                        CASE
                            WHEN th.finished_at IS NOT NULL
                            AND th.attended_at IS NOT NULL THEN TIMESTAMPDIFF(SECOND, th.attended_at, th.finished_at) / 60.0
                        END
                    ),
                    1
                ) AS avg_service_minutes
            FROM
                staff_assignments sa
                JOIN users u ON u.id = sa.staff_id
                JOIN roles r ON r.id = u.role_id
                JOIN barber_status bs ON bs.staff_id = u.id
                LEFT JOIN turns th ON th.barber_id = u.id
                AND th.finished_at IS NOT NULL
                AND th.attended_at IS NOT NULL
            WHERE
                sa.barbershop_id = ?
                AND r.role_name = 'barber'
                AND bs.current_status = 'active'
            GROUP BY
                u.id,
                u.username,
                bs.current_status,
                bs.is_accepting
            ORDER BY
                u.username ASC
        SQL;

        $rows = $this->query($barberSql, [$barbershopId])->fetchAll();
        if (empty($rows)) {
            return [null, null];
        }

        $unassignedTurns = [];
        $turnsByBarberId = [];

        foreach ($this->getAll($barbershopId) as $turn) {
            $id = $turn->barberId;
            if ($id === null) {
                $unassignedTurns[] = $turn;
            } else {
                $turnsByBarberId[$id->value][] = $turn;
            }
        }

        $slots = array_map(
            static fn (array $row) => BarberSlotData::fromDbRow(
                $row,
                $turnsByBarberId[(int) $row['barber_id']] ?? []
            ),
            $rows
        );

        return [$slots, $unassignedTurns];
    }
}
