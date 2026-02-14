<?php

declare(strict_types=1);

const SRC_DIR = __DIR__ . '/../';
require_once SRC_DIR . '/../vendor/autoload.php';
require_once SRC_DIR . 'config/db.php';

use App\Core;
use App\Controllers;

const DEFAULT_VIEW_NAME = 'home';
const LEGACY_VIEW_NAME = 'index';
const _DEFAULT_ROUTE = new Core\Route(DEFAULT_VIEW_NAME, new Controllers\HomeController());

const URIS = [
    // Valid home uris
    '' => _DEFAULT_ROUTE,
    DEFAULT_VIEW_NAME => _DEFAULT_ROUTE,
    LEGACY_VIEW_NAME => _DEFAULT_ROUTE,
];

# Create Router singleton
const _ROUTER = new Core\Router();
_ROUTER->dispatch();
