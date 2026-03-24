<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\{GET, RoutePrefix};
use App\Core\HttpResponse;
use App\Services\BarbershopService;

#[RoutePrefix('/api/barbershops')]
class BarbershopController extends BaseController
{
    public function __construct(
        private readonly BarbershopService $barbershopService
    ) {}

    #[GET('')]
    public function getAll(?string $search = null, ?bool $isOpen = null): void
    {
        $response = $this->barbershopService->getAll($search, $isOpen);
        HttpResponse::json($response);
    }
}
