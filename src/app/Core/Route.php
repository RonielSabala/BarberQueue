<?php

declare(strict_types=1);

namespace App\Core;

use App\Controllers\Core\BaseController;

class Route
{
    public function __construct(
        public readonly string $viewName,
        public readonly BaseController $viewController,
    ) {}
}
