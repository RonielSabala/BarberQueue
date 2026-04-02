<?php

declare(strict_types=1);

namespace App\Services\Barbershop;

use App\DTOs\Barbershops\Requests\CreateBarbershopPhotosRequest;
use App\Repositories\Barbershop\BarbershopPhotoRepository;
use App\Services\BaseService;
use App\DTOs\Barbershops\Responses\{
    BarbershopPhotoResponse,
    CreateBarbershopPhotosResponse,
    GetBarbershopPhotosResponse
};

class BarbershopPhotoService extends BaseService
{
    public function __construct(
        private readonly BarbershopPhotoRepository $barbershopPhotoRepository,
        private readonly BarbershopService $barbershopService,
    ) {}

    public function getPhotos(int $barbershopId): GetBarbershopPhotosResponse
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        $barbershopPhotos = $this->barbershopPhotoRepository->getAll($barbershopId);

        return new GetBarbershopPhotosResponse(
            photos: BarbershopPhotoResponse::fromEntities($barbershopPhotos)
        );
    }

    public function createPhotos(
        int $barbershopId,
        CreateBarbershopPhotosRequest $request
    ): CreateBarbershopPhotosResponse {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        $barbershopPhotos = $this->barbershopPhotoRepository->createPhotos($barbershopId, $request->photoUrls);

        return new CreateBarbershopPhotosResponse(
            uploaded: BarbershopPhotoResponse::fromEntities($barbershopPhotos)
        );
    }

    public function deletePhoto(int $barbershopId, int $photoId): bool
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        return $this->barbershopPhotoRepository->deletePhoto($barbershopId, $photoId);
    }
}
