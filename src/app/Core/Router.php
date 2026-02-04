<?php

namespace App\Core;

use App\Utils\UriUtils;
use App\Utils\GeneralUtils;


const _PAGE_NOT_FOUND_TEXT = 'Page Not Found...';

class Router
{
    public function dispatch()
    {
        // Start history if inactive
        if (!isset($_SESSION['uri_history'])) {
            $_SESSION['uri_history'] = [];
        }

        // Get URI and view name
        $uri = UriUtils::get();
        [$route, $view_name] = UriUtils::split($uri);

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
        if ($view_name === '' || ($route === '' && $view_name === 'index.php')) {
            $final_view_name = _DEFAULT_VIEW_NAME;
        } else {
            $final_view_name = preg_replace('/\.php$/', '', $view_name);
        }

        // Config template paths
        Template::$viewPath = $route . '/' . $final_view_name;
        Template::$partialViewsPath = $route;

        // Call controller
        $controller->handle(new Template());
    }
}
