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

    public function splitViewRoute(): array
    {
        $parts = explode('/', $this->viewRoute);
        if (\count($parts) === 1) {
            return ['', $this->viewRoute];
        }

        $viewDir = implode('/', \array_slice($parts, 0, -1));
        $viewName = end($parts);
        return [$viewDir, $viewName];
    }
}
