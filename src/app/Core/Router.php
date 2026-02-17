<?php

declare(strict_types=1);

namespace App\Core;

use App\Components\Alert;
use App\Utils\{TextUtils, UriCache};

require_once __DIR__ . '/View.php';

class Router
{
    private const LEGACY_VIEWS_DIR = 'src/public/views/';
    private const PAGE_NOT_FOUND_TEXT = 'Page Not Found...';

    public function dispatch(): void
    {
        UriCache::start();

        // Get uri and normalize it
        $uri = UriCache::getCurrentUri();
        $uri = TextUtils::removePrefix($uri, self::LEGACY_VIEWS_DIR);
        $uri = TextUtils::removeSuffix($uri, ViewConstants::FILE_EXT);

        // Get route
        $uriRoute = WebRoutes::getByUri($uri);
        if ($uriRoute === null) {
            http_response_code(404);
            echo new Alert(self::PAGE_NOT_FOUND_TEXT);
            exit;
        }

        $controller = $uriRoute->viewController;
        $viewTabName = $controller->viewTabName;
        if ($viewTabName !== null) {
            \define('CURRENT_TAB', $viewTabName);
        }

        // Get view parts
        [$viewDir, $viewName] = $uriRoute->splitViewRoute();
        if ($viewName === '' || $viewDir === '' && $viewName === LEGACY_VIEW_NAME) {
            $viewName = DEFAULT_VIEW_NAME;
        }

        $controller->handle(new View($viewDir, $viewName));
    }
}
