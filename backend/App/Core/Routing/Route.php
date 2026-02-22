<?php

declare(strict_types=1);

namespace App\Core\Routing;

use App\Controllers\BaseController;

class Route
{
    public function __construct(
        public string $uri,
        public readonly BaseController $controller,
        public readonly string $controllerMethod,
    ) {
        $escaped = preg_replace('/\{[^}]+\}/', '([^/]+)', $uri);
        $this->uri = '#^' . $escaped . '$#';
    }

    public function matches(string $uri): ?array
    {
        return preg_match($this->uri, $uri, $matches)
            ? \array_slice($matches, 1)
            : null;
    }
}
