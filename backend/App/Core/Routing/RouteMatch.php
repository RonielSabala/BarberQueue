<?php

declare(strict_types=1);

namespace App\Core\Routing;

use App\Controllers\BaseController;
use App\DTOs\BaseRequest;

class RouteMatch
{
    public function __construct(
        public readonly Route $route,
        public readonly array $params,
    ) {}

    public function dispatch(): void
    {
        $controller = $this->route->controller;
        $methodName = $this->route->controllerMethod;
        $reflection = new \ReflectionMethod($controller, $methodName);

        $args = $this->resolveArgs($reflection);
        $controller->{$methodName}(...$args);
    }

    private function resolveArgs(\ReflectionMethod $method): array
    {
        $args = [];
        foreach ($method->getParameters() as $param) {
            $type = $param->getType();
            if (!$type instanceof \ReflectionNamedType || $type->isBuiltin()) {
                continue;
            }

            $className = $type->getName();
            if (is_subclass_of($className, BaseRequest::class)) {
                $args[] = BaseController::mapToRequest($className);
            }
        }

        return array_merge($args, $this->params);
    }
}
