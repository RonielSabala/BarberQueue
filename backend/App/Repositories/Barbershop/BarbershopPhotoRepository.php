<?php

declare(strict_types=1);

namespace App\Repositories\Barbershop;

use App\Domain\Entities\Barbershop\BarbershopPhotoEntity;
use App\DTOs\Barbershops\Requests\CreateBarbershopPhotoRequest;
use App\Repositories\BaseRepository;
use App\Domain\ValueObjects\{Description, Id, PhotoUrl};

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

    /** @param CreateBarbershopPhotoRequest[] $photos
     *
     * @return BarbershopPhotoEntity[]
     */
    public function createPhotos(int $barbershopId, array $photos): array
    {
        $insertedPhotos = [];
        foreach ($photos as $photo) {
            $url = $photo->photoUrl->value;
            $description = $photo->photoDescription->value;
            $id = $this->insert([
                'barbershop_id' => $barbershopId,
                'photo_url' => $url,
                'photo_description' => $description,
            ]);

            $insertedPhotos[] = new BarbershopPhotoEntity(
                id: new Id($id),
                barbershopId: new Id($barbershopId),
                photoUrl: new PhotoUrl($url),
                photoDescription: new Description($description)
            );
        }

        return $insertedPhotos;
    }

    public function deletePhoto(int $barbershopId, int $photoId): bool
    {
        return $this->delete($photoId, ['barbershop_id' => $barbershopId]);
    }
}
