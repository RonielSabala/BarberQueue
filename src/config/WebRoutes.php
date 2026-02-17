<?php

declare(strict_types=1);

namespace Config;

use App\Controllers\BaseController;

class Route
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

class WebRoutes
{
    private static array $routes = [];

    public static function add(string $viewRoute, BaseController $viewController): void
    {
        $route = new Route($viewRoute, $viewController);
        self::$routes[$route->viewRoute] = $route;
    }

    public static function getByUri(string $viewRoute): ?Route
    {
        return self::$routes[$viewRoute] ?? null;
    }
}
