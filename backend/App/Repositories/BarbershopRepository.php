<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\Barbershop;
use App\Domain\ValueObjects\{
    Address,
    BarbershopName,
    Capacity,
    Email,
    Phone,
    PhotoUrl,
    TimeOfDay
};

class BarbershopRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'barbershops';
    protected const array ALLOWED_FIELDS = [
        'barbershop_name' => 'barbershop_name',
        'email' => 'email',
        'phone' => 'phone',
        'barbershop_address' => 'barbershop_address',
        'opens_at' => 'opens_at',
        'closes_at' => 'closes_at',
        'capacity' => 'capacity',
        'is_active' => 'is_active',
    ];

    public function findById(int $id): ?Barbershop
    {
        $sql = <<<'SQL'
            SELECT
                b.*,
                ROUND(AVG(r.rating), 1) AS average_rating
            FROM
                barbershops b
                LEFT JOIN barbershop_reviews r ON r.barbershop_id = b.id
            WHERE
                b.id = ?
            GROUP BY
                b.id
            LIMIT
                1
        SQL;

        return $this->fetchOne(Barbershop::class, $sql, [$id]);
    }

    public function findByEmail(string $email): ?Barbershop
    {
        $sql = <<<'SQL'
            SELECT
                b.*,
                ROUND(AVG(r.rating), 1) AS average_rating
            FROM
                barbershops b
                LEFT JOIN barbershop_reviews r ON r.barbershop_id = b.id
            WHERE
                b.email = ?
            GROUP BY
                b.id
            LIMIT
                1
        SQL;

        return $this->fetchOne(Barbershop::class, $sql, [$email]);
    }

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

    public function create(
        BarbershopName $barbershopName,
        Email $email,
        Phone $phone,
        Address $barbershopAddress,
        PhotoUrl $photoUrl,
        TimeOfDay $opensAt,
        TimeOfDay $closesAt,
        ?Capacity $capacity
    ): ?Barbershop {
        $sql = <<<'SQL'
            INSERT INTO barbershops (
                barbershop_name,
                email,
                phone,
                barbershop_address,
                photo_url,
                opens_at,
                closes_at,
                capacity
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        SQL;

        $this->query($sql, [
            $barbershopName->value,
            $email->value,
            $phone->value,
            $barbershopAddress->value,
            $photoUrl->value,
            $opensAt->value,
            $closesAt->value,
            $capacity?->value ?? 1,
        ]);

        $id = (int) $this->db->lastInsertId();
        return $this->findById($id);
    }
}
