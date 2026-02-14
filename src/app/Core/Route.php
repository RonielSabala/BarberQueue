<?php

declare(strict_types=1);

namespace App\Core;

use App\Controllers\BaseController;

class Route
{
    public function __construct(
        public readonly string $viewName,
        public readonly BaseController $viewController,
    ) {}
}
