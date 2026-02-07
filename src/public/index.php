<?php
const SRC_DIR = __DIR__ . '/../';
require_once SRC_DIR . 'vendor/autoload.php';
require_once SRC_DIR . 'config/db.php';

use App\Core\Router;
use App\Controllers;

// Controllers and routes
const _DEFAULT_VIEW_NAME = 'home';
const _DEFAULT_VIEW_ROUTE = ['view' => _DEFAULT_VIEW_NAME, 'controller' => Controllers\HomeController::class];
const _ROUTES = [
    // Default home route
    ''          => _DEFAULT_VIEW_ROUTE,
    'home.php'  => _DEFAULT_VIEW_ROUTE,
    'index.php' => _DEFAULT_VIEW_ROUTE,
];

# Create Router singleton
const _ROUTER = new Router();
_ROUTER->dispatch();
