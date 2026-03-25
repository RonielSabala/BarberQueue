<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\{Barbershop, BarbershopPhoto, BarbershopReview};
use App\Domain\ValueObjects\{
    Address,
    BarbershopName,
    Capacity,
    Email,
    Id,
    Phone,
    PhotoUrl,
    TimeOfDay
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

    public function getAll(?string $search = null, ?bool $isOpen = null): array
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

    public function getPhotos(int $barbershopId): array
    {
        $sql = <<<'SQL'
            SELECT
                *
            FROM
                barbershop_photos
            WHERE
                barbershop_id = ?
        SQL;

        return $this->fetchAll(BarbershopPhoto::class, $sql, [$barbershopId]);
    }

    public function addPhotos(int $barbershopId, array $photoUrls): array
    {
        $insertedPhotos = [];
        $sql = <<<'SQL'
            INSERT INTO
                barbershop_photos (barbershop_id, photo_url)
            VALUES
                (?, ?)
        SQL;

        foreach ($photoUrls as $url) {
            $photoUrlValue = $url->value;
            $this->query($sql, [$barbershopId, $photoUrlValue]);

            $id = $this->db->lastInsertId();
            $insertedPhotos[] = new BarbershopPhoto(
                id: new Id($id),
                barbershopId: new Id($barbershopId),
                photoUrl: new PhotoUrl($photoUrlValue)
            );
        }

        return $insertedPhotos;
    }

    public function deletePhoto(int $barbershopId, int $photoId): bool
    {
        $sql = <<<'SQL'
            DELETE FROM barbershop_photos
            WHERE
                id = ?
                AND barbershop_id = ?
        SQL;

        $stmt = $this->query($sql, [$photoId, $barbershopId]);
        return $stmt->rowCount() > 0;
    }

    public function getReviews(int $barbershopId): array
    {
        $sql = <<<'SQL'
            SELECT
                br.*,
                u.username
            FROM
                barbershop_reviews br
                JOIN users u ON br.user_id = u.id
            WHERE
                br.barbershop_id = ?
            ORDER BY
                br.created_at DESC
        SQL;

        return $this->fetchAll(BarbershopReview::class, $sql, [$barbershopId]);
    }

    public function addReview(int $userId, int $barbershopId, int $rating, string $content): ?BarbershopReview
    {
        $sql = <<<'SQL'
            INSERT INTO
                barbershop_reviews (user_id, barbershop_id, rating, content)
            VALUES
                (?, ?, ?, ?)
        SQL;

        $fetchSql = <<<'SQL'
            SELECT
                br.*,
                u.username
            FROM
                barbershop_reviews br
                JOIN users u ON br.user_id = u.id
            WHERE
                br.id = ?
            LIMIT
                1
        SQL;

        $this->query($sql, [$userId, $barbershopId, $rating, $content]);

        $id = $this->db->lastInsertId();
        return $this->fetchOne(BarbershopReview::class, $fetchSql, [$id]);
    }

    public function deleteReview(int $barbershopId, int $reviewId): bool
    {
        $sql = <<<'SQL'
            DELETE FROM barbershop_reviews
            WHERE
                id = ?
                AND barbershop_id = ?
        SQL;

        $stmt = $this->query($sql, [$reviewId, $barbershopId]);
        return $stmt->rowCount() > 0;
    }
}
