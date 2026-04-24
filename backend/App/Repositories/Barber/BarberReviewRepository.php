<?php

declare(strict_types=1);

namespace App\Repositories\Barber;

use App\Domain\Entities\Barber\BarberReviewEntity;
use App\Repositories\BaseRepository;

final readonly class BarberReviewRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'barber_reviews';

    private function reviewQuery(): string
    {
        return <<<'SQL'
            SELECT
                br.*,
                u.username,
                u.photo_url
            FROM
                barber_reviews br
                JOIN users u ON u.id = br.client_id
        SQL;
    }

    /** @return BarberReviewEntity[] */
    public function getAllByBarberId(int $barberId): array
    {
        $sql = $this->reviewQuery() . <<<'SQL'
            WHERE
                br.barber_id = ?
            ORDER BY
                br.created_at DESC
        SQL;

        return $this->fetchAll(BarberReviewEntity::class, $sql, [$barberId]);
    }

    public function createReview(
        int $clientId,
        int $barberId,
        int $rating,
        string $content
    ): ?BarberReviewEntity {
        $fetchSql = $this->reviewQuery() . <<<'SQL'
            WHERE
                br.id = ?
            LIMIT
                1
        SQL;

        $id = $this->insert([
            'client_id' => $clientId,
            'barber_id' => $barberId,
            'rating' => $rating,
            'content' => $content,
        ]);

        return $this->fetchOne(BarberReviewEntity::class, $fetchSql, [$id]);
    }

    public function deleteReview(int $reviewId, int $barberId): bool
    {
        return $this->delete($reviewId, ['barber_id' => $barberId]);
    }
}
