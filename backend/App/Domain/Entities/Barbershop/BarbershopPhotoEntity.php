<?php

declare(strict_types=1);

namespace App\Domain\Entities\Barbershop;

use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{Description, Id, PhotoUrl};

final readonly class BarbershopPhotoEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Id $barbershopId,
        public PhotoUrl $photoUrl,
        public Description $photoDescription,
    ) {}
}
