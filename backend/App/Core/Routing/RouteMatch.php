<?php

declare(strict_types=1);

namespace App\Core\Routing;

use App\DTOs\BaseRequest;
use App\Utils\TypeCoercion;

final readonly class RouteMatch
{
    public function __construct(
        public readonly Route $route,
        public readonly array $params,
    ) {}

    public function dispatch(): void
    {
        $controller = $this->route->controller;
        $methodName = $this->route->controllerMethod;
        $routeParams = $this->params;

        $reflection = new \ReflectionMethod($controller, $methodName);
        $args = [];

        foreach ($reflection->getParameters() as $param) {
            $type = $param->getType();
            $typeName = $type->getName();
            $isReflectionType = $type instanceof \ReflectionNamedType;

            // Map request class from JSON body
            if ($isReflectionType && is_subclass_of($typeName, BaseRequest::class)) {
                $args[] = $controller->buildRequest($typeName);
                continue;
            }

            // Query param
            if ($param->isDefaultValueAvailable() && $param->getDefaultValue() === null) {
                $value = $_GET[$param->getName()] ?? null;
                $args[] = $value === null ? $value : TypeCoercion::coerce($value, $typeName);
                continue;
            }

            // Route param
            $raw = array_shift($routeParams);
            $args[] = $isReflectionType ? TypeCoercion::coerce($raw, $typeName) : $raw;
        }

        $controller->{$methodName}(...$args);
    }
}
