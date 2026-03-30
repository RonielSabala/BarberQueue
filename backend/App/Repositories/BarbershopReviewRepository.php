<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Domain\Entities\BarbershopReviewEntity;

class BarbershopReviewRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'barbershop_reviews';

    private function reviewQuery(): string
    {
        return <<<'SQL'
            SELECT
                br.*,
                u.username
            FROM
                barbershop_reviews br
                JOIN users u ON br.client_id = u.id
        SQL;
    }

    public function getById(int $id): ?BarbershopReviewEntity
    {
        $sql = $this->reviewQuery() . <<<'SQL'
            WHERE
                br.id = ?
            LIMIT
                1
        SQL;

        return $this->fetchOne(BarbershopReviewEntity::class, $sql, [$id]);
    }

    public function getAllByBarbershopId(int $barbershopId): array
    {
        $sql = $this->reviewQuery() . <<<'SQL'
            WHERE
                br.barbershop_id = ?
            ORDER BY
                br.created_at DESC
        SQL;

        return $this->fetchAll(BarbershopReviewEntity::class, $sql, [$barbershopId]);
    }

    public function createReview(
        int $clientId,
        int $barbershopId,
        int $rating,
        string $content
    ): ?BarbershopReviewEntity {
        $id = $this->insert([
            'client_id' => $clientId,
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
