<?php

declare(strict_types=1);

namespace Config;

use App\Controllers\BaseController;

class RoutesCollection
{
    private static array $routes = [];

    public static function add(string $viewRoute, BaseController $viewController): void
    {
        $route = new BaseRoute($viewRoute, $viewController);
        self::$routes[$route->viewRoute] = $route;
    }

    public static function getByUri(string $viewRoute): ?BaseRoute
    {
        return self::$routes[$viewRoute] ?? null;
    }
}
