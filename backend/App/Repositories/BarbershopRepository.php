<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\{
    Barbershop,
    BarbershopPhoto,
    BarbershopReview,
    Employee
};
use App\Domain\ValueObjects\{Id, PhotoUrl};

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
        string $barbershopName,
        string $email,
        string $phone,
        string $barbershopAddress,
        string $photoUrl,
        string $opensAt,
        string $closesAt,
        int $capacity
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
            $barbershopName,
            $email,
            $phone,
            $barbershopAddress,
            $photoUrl,
            $opensAt,
            $closesAt,
            $capacity,
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
        $sql = <<<'SQL'
            INSERT INTO
                barbershop_photos (barbershop_id, photo_url)
            VALUES
                (?, ?)
        SQL;

        $insertedPhotos = [];
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

    public function getEmployees(int $barbershopId): array
    {
        $sql = <<<'SQL'
            SELECT
                u.id,
                sa.barbershop_id,
                u.username,
                u.email,
                u.phone,
                r.role_name AS role,
                sa.start_time AS start_time,
                sa.end_time AS end_time,
                GROUP_CONCAT(
                    wd.day_of_week
                    ORDER BY
                        wd.day_of_week ASC
                ) AS working_days
            FROM
                users u
                JOIN roles r ON u.role_id = r.id
                JOIN staff_assignments sa ON u.id = sa.staff_id
                LEFT JOIN working_days wd ON u.id = wd.staff_id
            WHERE
                sa.barbershop_id = ?
            GROUP BY
                u.id,
                sa.barbershop_id,
                r.role_name,
                sa.start_time,
                sa.end_time
        SQL;

        return $this->fetchAll(Employee::class, $sql, [$barbershopId]);
    }

    public function createAndAssignEmployee(
        int $barbershopId,
        array $userData,
        array $assignmentData,
        array $days
    ): int {
        $userSql = <<<'SQL'
            INSERT INTO
                users (role_id, username, email, phone, password_hash)
            VALUES
                (?, ?, ?, ?, ?)
        SQL;

        $assignSql = <<<'SQL'
            INSERT INTO
                staff_assignments (staff_id, barbershop_id, start_time, end_time)
            VALUES
                (?, ?, ?, ?)
        SQL;

        $daySql = <<<'SQL'
            INSERT INTO
                working_days (staff_id, day_of_week)
            VALUES
                (?, ?)
        SQL;

        return $this->transaction(function () use (
            $barbershopId,
            $userData,
            $assignmentData,
            $days,
            $userSql,
            $assignSql,
            $daySql
        ) {
            // Insert user
            $this->query($userSql, array_values($userData));
            $staffId = (int) $this->db->lastInsertId();

            // Create staff assignment
            $this->query($assignSql, [
                $staffId,
                $barbershopId,
                $assignmentData['start_time'],
                $assignmentData['end_time'],
            ]);

            // Insert working days
            foreach ($days as $day) {
                $this->query($daySql, [$staffId, $day]);
            }

            return $staffId;
        });
    }

    public function deleteEmployeeAssignment(int $employeeId, int $barbershopId): bool
    {
        $sql = <<<'SQL'
        DELETE FROM staff_assignments
        WHERE
            staff_id = ?
            AND barbershop_id = ?
        SQL;

        $stmt = $this->query($sql, [$employeeId, $barbershopId]);
        return $stmt->rowCount() > 0;
    }
}
