<?php

declare(strict_types=1);

namespace App\Core;

use App\Utils\UriUtils;
use App\Utils\UriCache;
use App\Utils\GeneralUtils;

const _LEGACY_VIEWS_PATH = "src/public/views/";
const _PAGE_NOT_FOUND_TEXT = 'Page Not Found...';

class Router
{
    public function dispatch()
    {
        UriCache::start();

        // Get route and view
        $uri = UriCache::getCurrentUri();
        $uri = GeneralUtils::removePrefix($uri, _LEGACY_VIEWS_PATH);
        [$route, $view] = UriUtils::split($uri);

        // Get uri route
        $uri_route = _ROUTES[$uri] ?? null;
        if ($uri_route) {
            $controller = new $uri_route['controller']();
            define('CURRENT_PAGE', $uri_route['page'] ?? '');
        }

        // Validate view access
        if ($uri_route === null) {
            http_response_code(404);
            GeneralUtils::echoAlert(_PAGE_NOT_FOUND_TEXT);
            exit;
        }

        // Get final view name
        if ($view === '' || ($route === '' && $view === 'index.php')) {
            $view_name = _DEFAULT_VIEW_NAME;
        } else {
            $view_name = preg_replace('/\.php$/', '', $view);
        }

        // Config template paths
        Template::$viewPath = $route . '/' . $view_name;
        Template::$partialViewsPath = $route;

        // Call controller
        $controller->handle(new Template());
    }
}
