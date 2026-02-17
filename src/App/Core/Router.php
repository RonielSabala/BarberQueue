<?php

declare(strict_types=1);

namespace App\Core;

use App\Components\Alert;
use App\Routing\RoutesCollection;
use App\Utils\TextUtils;

require_once __DIR__ . '/View.php';

class Router
{
    public const LEGACY_VIEW_NAME = 'index';
    public const DEFAULT_VIEW_NAME = 'home';
    private const LEGACY_VIEWS_DIR = 'src/public/views/';
    private const PAGE_NOT_FOUND_TEXT = 'Page Not Found...';

    public function dispatch(): void
    {
        UriCache::start();

        // Get uri and normalize it
        $uri = UriCache::getCurrentUri();
        $uri = TextUtils::removePrefix($uri, self::LEGACY_VIEWS_DIR);
        $uri = TextUtils::removeSuffix($uri, ViewPaths::VIEWS_FILE_EXT);

        // Get route
        $uriRoute = RoutesCollection::getByUri($uri);
        if ($uriRoute === null) {
            http_response_code(404);
            echo new Alert(self::PAGE_NOT_FOUND_TEXT);
            exit;
        }

        $viewController = $uriRoute->viewController;
        $viewTabName = $viewController->viewTabName;
        if ($viewTabName !== null) {
            \define('CURRENT_TAB', $viewTabName);
        }

        // Get view parts
        [$viewDir, $viewName] = $uriRoute->splitViewRoute();
        if ($viewName === '' || $viewDir === '' && $viewName === self::LEGACY_VIEW_NAME) {
            $viewName = self::DEFAULT_VIEW_NAME;
        }

        $viewController->handle(new View($viewDir, $viewName));
    }
}
