<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\{
    BarbershopEntity
};

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

    public function getAll(?string $search = null, ?bool $isOpen = null): array
    {
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

        $sql .= ' GROUP BY b.id';
        return $this->fetchAll(BarbershopEntity::class, $sql, $params);
    }

    public function createBarbershop(
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
}
