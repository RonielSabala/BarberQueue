<?php

declare(strict_types=1);

namespace App\Routing;

use App\Controllers\BaseController;

class BaseRoute
{
    public function __construct(
        public readonly string $viewRoute,
        public readonly BaseController $viewController,
    ) {}
}
