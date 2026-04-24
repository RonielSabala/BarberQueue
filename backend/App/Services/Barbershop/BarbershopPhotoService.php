<?php

declare(strict_types=1);

namespace App\Services\Barbershop;

use App\DTOs\Barbershops\Requests\CreateBarbershopPhotosRequest;
use App\DTOs\Barbershops\Responses\BarbershopPhotoResponse;
use App\Repositories\Barbershop\BarbershopPhotoRepository;
use App\Services\BaseService;

final readonly class BarbershopPhotoService extends BaseService
{
    public function __construct(
        private readonly BarbershopPhotoRepository $barbershopPhotoRepository,
        private readonly BarbershopService $barbershopService,
    ) {}

    /** @return BarbershopPhotoResponse[] */
    public function getPhotos(int $barbershopId): array
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        $barbershopPhotos = $this->barbershopPhotoRepository->getAll($barbershopId);
        return BarbershopPhotoResponse::fromEntities($barbershopPhotos);
    }

    /** @return BarbershopPhotoResponse[] */
    public function createPhotos(
        int $barbershopId,
        CreateBarbershopPhotosRequest $request
    ): array {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        $barbershopPhotos = $this->barbershopPhotoRepository->createPhotos(
            $barbershopId,
            $request->photos
        );

        return BarbershopPhotoResponse::fromEntities($barbershopPhotos);
    }

    public function deletePhoto(int $barbershopId, int $photoId): bool
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        return $this->barbershopPhotoRepository->deletePhoto($barbershopId, $photoId);
    }
}
