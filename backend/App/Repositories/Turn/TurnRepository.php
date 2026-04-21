<?php

declare(strict_types=1);

namespace App\Repositories\Turn;

use App\Domain\Entities\Turn\TurnEntity;
use App\Domain\Queue\BarberSlotData;
use App\Domain\ValueObjects\DateTimeString;
use App\Repositories\BaseRepository;

readonly class TurnRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'turns';
    protected const array UPDATABLE_FIELDS = [
        'barber_id',
        'attended_at',
        'finished_at',
    ];

    private function turnQuery(): string
    {
        return <<<'SQL'
            SELECT
                t.*,
                CASE
                    WHEN t.client_id IS NOT NULL THEN t.client_id
                    ELSE t.member_id
                END AS owner_id,
                CASE
                    WHEN t.client_id IS NOT NULL THEN u.username
                    ELSE gm.member_name
                END AS owner_name,
                CASE
                    WHEN t.client_id IS NOT NULL THEN 'client'
                    ELSE 'member'
                END AS owner_type,
                CASE
                    WHEN t.client_id IS NOT NULL THEN cs.current_status
                    ELSE gm.current_status
                END AS owner_status,
                CASE
                    WHEN t.group_id IS NOT NULL THEN (
                        SELECT
                            COUNT(*)
                        FROM
                            turns t2
                        WHERE
                            t2.group_id = t.group_id
                    )
                    ELSE NULL
                END AS group_size
            FROM
                turns t
                LEFT JOIN users u ON u.id = t.client_id
                LEFT JOIN client_status cs ON cs.client_id = t.client_id
                LEFT JOIN group_members gm ON gm.id = t.member_id
        SQL;
    }

    public function getById(int $id): ?TurnEntity
    {
        $sql = $this->turnQuery() . <<<'SQL'
            WHERE
                t.id = ?
        SQL;

        return $this->fetchOne(TurnEntity::class, $sql, [$id]);
    }

    /** @return TurnEntity[] */
    public function getAll(int $barbershopId, ?int $barberId = null): array
    {
        $sql = $this->turnQuery() . <<<'SQL'
            WHERE
                t.barbershop_id = ?
                AND t.finished_at IS NULL
        SQL;

        $params = [$barbershopId];
        if ($barberId !== null) {
            $sql .= ' AND t.barber_id = ?';
            $params[] = $barberId;
        }

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
                COALESCE(bst.avg_service_minutes, shop_bst.avg_service_minutes) AS avg_service_minutes
            FROM
                staff_assignments sa
                JOIN users u ON u.id = sa.staff_id
                JOIN roles r ON r.id = u.role_id
                JOIN barber_status bs ON bs.barber_id = u.id
                LEFT JOIN barber_stats bst ON bst.barber_id = u.id
                LEFT JOIN barbershop_stats shop_bst ON shop_bst.barbershop_id = sa.barbershop_id
            WHERE
                sa.barbershop_id = ?
                AND r.role_name = 'barber'
                AND bs.current_status = 'active'
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

    private function createTurn(mixed $fields): int
    {
        return $this->insert(array_filter(
            $fields,
            static fn ($value) => $value !== null
        ));
    }

    public function createClientTurn(int $barbershopId, int $clientId, ?int $barberId, ?int $groupId): int
    {
        return $this->createTurn([
            'barbershop_id' => $barbershopId,
            'client_id' => $clientId,
            'barber_id' => $barberId,
            'group_id' => $groupId,
        ]);
    }

    public function createMemberTurn(int $barbershopId, int $memberId, int $groupId, ?int $barberId): int
    {
        return $this->createTurn([
            'barbershop_id' => $barbershopId,
            'member_id' => $memberId,
            'group_id' => $groupId,
            'barber_id' => $barberId,
        ]);
    }

    public function updateBarberId(int $turnId, int $barberId): void
    {
        $this->update($turnId, ['barber_id' => $barberId]);
    }

    public function setAttendedAt(int $turnId): void
    {
        $this->update($turnId, ['attended_at' => date(DateTimeString::DATETIME_FORMAT)]);
    }

    public function setFinishedAt(int $turnId): void
    {
        $this->update($turnId, ['finished_at' => date(DateTimeString::DATETIME_FORMAT)]);
    }
}
