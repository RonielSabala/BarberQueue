<?php

declare(strict_types=1);

namespace App\Core;

use App\Attributes\Route;
use App\Controllers\BaseController;
use App\Utils\{TextUtils, UriUtils};

class Router
{
    private const FILE_EXTENSION = '.php';
    private const CONTROLLER_NAME = 'Controller';
    private const CONTROLLER_FILE_SUFFIX = self::CONTROLLER_NAME . self::FILE_EXTENSION;
    private const CONTROLLER_NAMESPACE = 'App\\' . self::CONTROLLER_NAME . 's';
    private const CONTROLLERS_PATH = __DIR__ . '\..\\' . self::CONTROLLER_NAME . 's';
    private const PARAM_REPLACEMENT = '/\{[^}]+\}/';
    private const PARAM_CAPTURE = '([^/]+)';

    private static array $routes = [];

    public static function init(): void
    {
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator(self::CONTROLLERS_PATH)
        );

        foreach ($iterator as $file) {
            $filename = $file->getFilename();
            if (!str_ends_with($filename, self::CONTROLLER_FILE_SUFFIX)) {
                continue;
            }

            $filePath = $file->getPathname();
            $classFile = self::CONTROLLER_NAMESPACE . TextUtils::removePrefix($filePath, self::CONTROLLERS_PATH);
            $class = TextUtils::removeSuffix($classFile, self::FILE_EXTENSION);

            if (!is_subclass_of($class, BaseController::class)) {
                continue;
            }

            self::registerController($class);
        }
    }

    public static function registerController(string $controllerClass): void
    {
        $reflection = new \ReflectionClass($controllerClass);

        foreach ($reflection->getMethods(\ReflectionMethod::IS_PUBLIC) as $method) {
            $attributes = $method->getAttributes(Route::class, \ReflectionAttribute::IS_INSTANCEOF);

            foreach ($attributes as $attribute) {
                $route = $attribute->newInstance();
                self::addRoute($route->getMethod(), $route->uri, [$controllerClass, $method->getName()]);
            }
        }
    }

    private static function addRoute(string $method, string $uri, array $action): void
    {
        self::$routes[] = compact('method', 'uri', 'action');
    }

    public static function dispatch(): void
    {
        $uri = UriUtils::getCurrentUri();
        $method = $_SERVER['REQUEST_METHOD'];

        foreach (self::$routes as $route) {
            $pattern = '#^' . preg_replace(self::PARAM_REPLACEMENT, self::PARAM_CAPTURE, $route['uri']) . '$#';

            if ($route['method'] === $method && preg_match($pattern, $uri, $matches)) {
                array_shift($matches);
                [$controllerClass, $methodName] = $route['action'];
                $controller = new $controllerClass();
                $controller->{$methodName}(...$matches);
                return;
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
    }
}
