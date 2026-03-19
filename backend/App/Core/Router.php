<?php

declare(strict_types=1);

namespace App\Core;

use App\Core\Routing\RouteRegistry;
use App\Exceptions\BaseException;
use App\Utils\{ClassesDiscovery, UriUtils};

class Router
{
    private const CONTROLLERS_PATH = __DIR__ . '/../Controllers';
    private const CONTROLLER_SUFFIX = 'Controller';
    private const CONTROLLERS_NAMESPACE = 'App\Controllers';

    private static RouteRegistry $registry;

    public static function init(): void
    {
        $container = new Container();
        self::$registry = new RouteRegistry($container);

        // Get all controller classes
        $controllers = new ClassesDiscovery(
            self::CONTROLLERS_PATH,
            self::CONTROLLER_SUFFIX,
            self::CONTROLLERS_NAMESPACE
        );

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
            HttpResponse::error('Route not found', HttpStatus::NotFound);
            return;
        }

        try {
            $match->dispatch();
        } catch (BaseException $e) {
            HttpResponse::error($e->getMessage(), $e->getStatus());
        } catch (\Throwable $e) {
            HttpResponse::error('An unexpected error occurred', HttpStatus::InternalServerError);
        }
    }
}
