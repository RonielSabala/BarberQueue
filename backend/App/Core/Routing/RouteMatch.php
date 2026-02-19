<?php

declare(strict_types=1);

namespace App\Core\Routing;

class RouteMatch
{
    public function __construct(
        public readonly Route $route,
        public readonly array $params,
    ) {}

    public function dispatch(): void
    {
        $controller = $this->route->controller;
        $controllerMethod = $this->route->controllerMethod;
        $controller->{$controllerMethod}(...$this->params);
    }
}
