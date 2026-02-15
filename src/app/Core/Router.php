<?php

declare(strict_types=1);

namespace App\Core;

use App\Components\Alert;
use App\Utils\TextUtils;
use App\Utils\UriCache;
use App\Utils\UriUtils;

require_once __DIR__ . '/Template.php';

class Router
{
    private const LEGACY_VIEWS_DIR = 'src/public/views/';
    private const PAGE_NOT_FOUND_TEXT = 'Page Not Found...';

    public function dispatch()
    {
        UriCache::start();

        // Get uri and normalize it
        $uri = UriCache::getCurrentUri();
        $uri = TextUtils::removePrefix($uri, self::LEGACY_VIEWS_DIR);
        $uri = TextUtils::removeSuffix($uri, Constants::VIEWS_FILE_EXT);

        // Get route
        $uriRoute = URIS[$uri] ?? null;
        if ($uriRoute === null) {
            http_response_code(404);
            echo new Alert(self::PAGE_NOT_FOUND_TEXT);
            exit;
        }

        define('CURRENT_PAGE', $uriRoute->viewName);

        // Get view parts
        [$viewDir, $viewName] = UriUtils::split($uri);
        if ($viewName === '' || $viewDir === '' && $viewName === LEGACY_VIEW_NAME) {
            $viewName = DEFAULT_VIEW_NAME;
        }

        Template::config($viewDir, $viewName);

        $viewTemplate = new Template();
        $viewController = new $uriRoute->viewController();
        $viewController->handle($viewTemplate);
    }
}
