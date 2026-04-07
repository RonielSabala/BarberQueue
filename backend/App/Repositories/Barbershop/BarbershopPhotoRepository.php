<?php

declare(strict_types=1);

namespace App\Repositories\Barbershop;

use App\Domain\Entities\Barbershop\BarbershopPhotoEntity;
use App\Repositories\BaseRepository;
use App\Domain\ValueObjects\{Id, PhotoUrl};

final readonly class BarbershopPhotoRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'barbershop_photos';

    /** @return BarbershopPhotoEntity[] */
    public function getAll(int $barbershopId): array
    {
        $sql = <<<'SQL'
            SELECT
                *
            FROM
                barbershop_photos
            WHERE
                barbershop_id = ?
        SQL;

        return $this->fetchAll(BarbershopPhotoEntity::class, $sql, [$barbershopId]);
    }

    public function createPhotos(int $barbershopId, array $photoUrls): array
    {
        $insertedPhotos = [];
        foreach ($photoUrls as $photoUrl) {
            $url = $photoUrl->value;
            $id = $this->insert([
                'barbershop_id' => $barbershopId,
                'photo_url' => $url,
            ]);

            $insertedPhotos[] = new BarbershopPhotoEntity(
                id: new Id($id),
                barbershopId: new Id($barbershopId),
                photoUrl: new PhotoUrl($url)
            );
        }

        return $insertedPhotos;
    }

    public function deletePhoto(int $barbershopId, int $photoId): bool
    {
        return $this->delete($photoId, ['barbershop_id' => $barbershopId]);
    }
}
