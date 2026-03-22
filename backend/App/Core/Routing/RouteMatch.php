<?php

declare(strict_types=1);

namespace App\Core\Routing;

use App\DTOs\BaseRequest;
use App\Utils\TypeCoercion;

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
        $params = $this->params;

        $reflection = new \ReflectionMethod($controller, $methodName);
        $args = [];

        foreach ($reflection->getParameters() as $param) {
            $type = $param->getType();

            if (!$type instanceof \ReflectionNamedType) {
                $args[] = array_shift($params);
                continue;
            }

            $typeName = $type->getName();

            // Map request class from JSON body
            if (is_subclass_of($typeName, BaseRequest::class)) {
                $args[] = $controller->buildRequest($typeName);
                continue;
            }

            $raw = array_shift($params);
            $args[] = TypeCoercion::coerce($raw, $typeName);
        }

        $controller->{$methodName}(...$args);
    }
}
