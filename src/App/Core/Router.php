<?php

declare(strict_types=1);

namespace App\Core;

use App\Routing\RoutesCollection;
use App\Utils\UriUtils;

class Router
{
    private const PAGE_NOT_FOUND_TEXT = 'Page Not Found...';

    public function dispatch(): void
    {
        $uri = UriUtils::getCurrentUri();

        // Get route
        $uriRoute = RoutesCollection::getByUri($uri);
        if ($uriRoute === null) {
            http_response_code(404);
            throw new \Exception(self::PAGE_NOT_FOUND_TEXT);
            exit;
        }

        $viewController = $uriRoute->viewController;
        $viewController->handle();
    }
}
