<?php

declare(strict_types=1);

namespace App\Core;

use App\Controllers\Core\Controller;

class Route
{
    public function __construct(
        public readonly string $viewRoute,
        public readonly Controller $viewController,
    ) {}
}

class WebRoutes
{
    private static array $routes = [];

    public static function add(string $viewRoute, Controller $viewController): void
    {
        $route = new Route($viewRoute, $viewController);
        self::$routes[$route->viewRoute] = $route;
    }

    public static function getByUri(string $viewRoute): ?Route
    {
        return self::$routes[$viewRoute] ?? null;
    }
}
