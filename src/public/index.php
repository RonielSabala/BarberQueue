<?php

declare(strict_types=1);

const PUBLIC_DIR = __DIR__;
const SRC_DIR = PUBLIC_DIR . '/..';
require_once SRC_DIR . '/../vendor/autoload.php';
require_once SRC_DIR . '/config/db.php';

use App\Core\Route;
use App\Core\Router;
use App\Controllers;

const DEFAULT_VIEW_NAME = 'home';
const LEGACY_VIEW_NAME = 'index';
const _DEFAULT_ROUTE = new Route(DEFAULT_VIEW_NAME, new Controllers\HomeController());

const URIS = [
    // Valid home uris
    '' => _DEFAULT_ROUTE,
    DEFAULT_VIEW_NAME => _DEFAULT_ROUTE,
    LEGACY_VIEW_NAME => _DEFAULT_ROUTE,
    'health' => new Route('health', new Controllers\HealthController()),
];

# Create Router singleton
const _ROUTER = new Router();
_ROUTER->dispatch();
