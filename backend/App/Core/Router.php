<?php

declare(strict_types=1);

namespace App\Core;

use App\Config\LoggerProvider;
use App\Exceptions\Base\BaseException;
use Monolog\Logger;
use App\Core\Routing\{ClassesDiscovery, RouteRegistry};

final class Router
{
    private const CONTROLLERS_PATH = __DIR__ . '/../Controllers';
    private const CONTROLLER_SUFFIX = 'Controller';
    private const CONTROLLERS_NAMESPACE = 'App\Controllers';

    private static RouteRegistry $registry;
    private static Logger $logger;

    public static function init(Container $container): void
    {
        self::$registry = new RouteRegistry($container);
        self::$logger = LoggerProvider::get();

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
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        $match = self::$registry->findMatch($httpMethod, $uri);
        if ($match === null) {
            HttpResponse::error('Route not found', HttpStatus::NotFound);
            return;
        }

        try {
            $match->dispatch();
        } catch (BaseException $e) {
            $errorMsg = $e->getMessage();
            self::$logger->error($errorMsg, ['exception' => $e]);

            HttpResponse::error($errorMsg, $e->getStatus());
        } catch (\Throwable $e) {
            self::$logger->critical($e->getMessage(), ['exception' => $e]);

            HttpResponse::error('An unexpected error occurred', HttpStatus::InternalServerError);
        }
    }
}
