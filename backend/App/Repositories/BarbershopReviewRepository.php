<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\BarbershopReviewEntity;

class BarbershopReviewRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'barbershop_reviews';

    public function getById(int $id): ?BarbershopReviewEntity
    {
        $sql = <<<'SQL'
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

        return $this->fetchOne(BarbershopReviewEntity::class, $sql, [$id]);
    }

    public function getAll(int $barbershopId): array
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

        return $this->fetchAll(BarbershopReviewEntity::class, $sql, [$barbershopId]);
    }

    public function createReview(
        int $userId,
        int $barbershopId,
        int $rating,
        string $content
    ): ?BarbershopReviewEntity {
        $id = $this->insert([
            'user_id' => $userId,
            'barbershop_id' => $barbershopId,
            'rating' => $rating,
            'content' => $content,
        ]);

        return $this->getById($id);
    }

    public function deleteReview(int $barbershopId, int $reviewId): bool
    {
        return $this->delete($reviewId, ['barbershop_id' => $barbershopId]);
    }
}
