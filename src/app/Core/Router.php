<?php

declare(strict_types=1);

namespace App\Core;

use App\Utils\UriUtils;
use App\Utils\UriCache;
use App\Utils\GeneralUtils;

require_once __DIR__ .  '/Template.php';

class Router
{
    const LEGACY_VIEWS_DIR = 'src/public/views/';
    const PAGE_NOT_FOUND_TEXT = 'Page Not Found...';

    public function dispatch()
    {
        UriCache::start();

        // Get uri and normalize it
        $uri = UriCache::getCurrentUri();
        $uri = GeneralUtils::removePrefix($uri, self::LEGACY_VIEWS_DIR);
        $uri = GeneralUtils::removeSuffix($uri, Constants::VIEWS_FILE_EXT);

        // Get route
        $uriRoute = URIS[$uri] ?? null;
        if ($uriRoute === null) {
            http_response_code(404);
            GeneralUtils::echoAlert(self::PAGE_NOT_FOUND_TEXT);
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
