<?php

declare(strict_types=1);

namespace App\Core;

use App\Utils\UriUtils;
use App\Utils\UriCache;
use App\Utils\GeneralUtils;

require_once __DIR__ .  '/Template.php';

const _LEGACY_VIEWS_DIR = 'src/public/views/';
const _PAGE_NOT_FOUND_TEXT = 'Page Not Found...';

class Router
{
    public function dispatch()
    {
        UriCache::start();

        // Get uri and normalize it
        $uri = UriCache::getCurrentUri();
        $uri = GeneralUtils::removePrefix($uri, _LEGACY_VIEWS_DIR);
        $uri = GeneralUtils::removeSuffix($uri, _VIEWS_FILE_EXTENSION);

        // Get route
        $uriRoute = _URIS[$uri] ?? null;
        if ($uriRoute === null) {
            http_response_code(404);
            GeneralUtils::echoAlert(_PAGE_NOT_FOUND_TEXT);
            exit;
        }

        define('CURRENT_PAGE', $uriRoute->viewName);

        // Get view parts
        [$viewDir, $viewName] = UriUtils::split($uri);
        if ($viewName === '' || $viewDir === '' && $viewName === _LEGACY_VIEW_NAME) {
            $viewName = _DEFAULT_VIEW_NAME;
        }

        Template::config($viewDir, $viewName);

        $viewTemplate = new Template();
        $viewController = new $uriRoute->viewController();
        $viewController->handle($viewTemplate);
    }
}
