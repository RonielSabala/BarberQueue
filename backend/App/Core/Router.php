<?php

declare(strict_types=1);

namespace App\Core;

use App\Core\Routing\RouteRegistry;
use App\Utils\{ClassesDiscovery, UriUtils};

class Router
{
    private const CONTROLLERS_PATH = __DIR__ . '/../Controllers';
    private const CONTROLLER_SUFFIX = 'Controller';
    private const CONTROLLERS_NAMESPACE = 'App\Controllers';

    private static RouteRegistry $registry;

    public static function init(): void
    {
        self::$registry = new RouteRegistry();
        $controllers = new ClassesDiscovery(self::CONTROLLERS_PATH, self::CONTROLLER_SUFFIX, self::CONTROLLERS_NAMESPACE);

        foreach ($controllers->discover() as $controllerClass) {
            self::$registry->registerController($controllerClass);
        }
    }

    public static function dispatch(): void
    {
        $httpMethod = $_SERVER['REQUEST_METHOD'];
        $uri = UriUtils::getCurrentUri();

        $match = self::$registry->findMatch($httpMethod, $uri);
        if ($match === null) {
            HttpResponse::notFound('Route not found');
            return;
        }

        $match->dispatch();
    }
}
