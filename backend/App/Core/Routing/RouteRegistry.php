<?php

declare(strict_types=1);

namespace App\Core\Routing;

use App\Core\Container;
use App\Attributes\{HttpMethod, RoutePrefix};

final class RouteRegistry
{
    /** @var Route[] */
    private array $routes = [];

    public function __construct(private readonly Container $container) {}

    public function registerController(string $controllerClass): void
    {
        $reflection = new \ReflectionClass($controllerClass);

        $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);
        $prefixAttributes = $reflection->getAttributes(RoutePrefix::class);

        $controller = $this->container->make($controllerClass);
        $routePrefix = $prefixAttributes ? $prefixAttributes[0]->newInstance()->prefix : '';

        // Register routes based on method attributes
        foreach ($methods as $method) {
            $methodName = $method->getName();
            $attributes = $method->getAttributes(HttpMethod::class, \ReflectionAttribute::IS_INSTANCEOF);

            foreach ($attributes as $attribute) {
                $httpRoute = $attribute->newInstance();
                $this->routes[$httpRoute->getName()][] = new Route(
                    $routePrefix . $httpRoute->uri,
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
