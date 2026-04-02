<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\BarbershopClientEntity;

class BarbershopClientRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'client_status';
    protected const array UPDATABLE_FIELDS = [
        'barbershop_id',
        'current_status',
    ];

    private function clientStatusQuery(): string
    {
        return <<<'SQL'
            SELECT
                cs.*,
                u.username
            FROM
                client_status cs
                JOIN users u ON cs.client_id = u.id
        SQL;
    }

    public function getByClientId(int $clientId): ?BarbershopClientEntity
    {
        $sql = $this->clientStatusQuery() . <<<'SQL'
            WHERE
                client_id = ?
        SQL;

        return $this->fetchOne(BarbershopClientEntity::class, $sql, [$clientId]);
    }

    /** @return BarbershopClientEntity[] */
    public function getAllAtBarbershop(int $barbershopId): array
    {
        $sql = $this->clientStatusQuery() . <<<'SQL'
            WHERE
                cs.barbershop_id = ?
                AND cs.current_status = 'at_barbershop'
        SQL;

        return $this->fetchAll(BarbershopClientEntity::class, $sql, [$barbershopId]);
    }

    public function updateBarbershopStatus(int $clientId, ?int $barbershopId, string $currentStatus): void
    {
        $this->updateFrom(
            static::TABLE_NAME,
            [
                'barbershop_id' => $barbershopId,
                'current_status' => $currentStatus,
            ],
            ['client_id' => $clientId]
        );
    }

    public function updateStatus(int $clientId, string $currentStatus): void
    {
        $this->updateFrom(
            static::TABLE_NAME,
            ['current_status' => $currentStatus],
            ['client_id' => $clientId]
        );
    }
}
