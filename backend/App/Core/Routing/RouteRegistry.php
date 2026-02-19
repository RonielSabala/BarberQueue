<?php

declare(strict_types=1);

namespace App\Core\Routing;

use App\Attributes\HttpRoute;

class RouteRegistry
{
    /** @var Route[] */
    private array $routes = [];

    public function registerController(string $controllerClass): void
    {
        $reflection = new \ReflectionClass($controllerClass);
        $controller = $reflection->newInstance();
        $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);

        // Register routes based on method attributes
        foreach ($methods as $method) {
            $methodName = $method->getName();
            $attributes = $method->getAttributes(HttpRoute::class, \ReflectionAttribute::IS_INSTANCEOF);

            foreach ($attributes as $attribute) {
                $httpRoute = $attribute->newInstance();
                $this->routes[$httpRoute->getMethod()][] = new Route(
                    $httpRoute->uri,
                    $controller,
                    $methodName,
                );
            }
        }
    }

    public function findMatch(string $httpMethod, string $uri): ?RouteMatch
    {
        $routes = $this->routes[$httpMethod] ?? [];
        foreach ($routes as $route) {
            $params = $route->matches($uri);
            if ($params === null) {
                continue;
            }

            return new RouteMatch($route, $params);
        }

        return null;
    }
}
