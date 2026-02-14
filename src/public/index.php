<?php

declare(strict_types=1);

const SRC_DIR = __DIR__ . '/../';
require_once SRC_DIR . '/../vendor/autoload.php';
require_once SRC_DIR . 'config/db.php';

use App\Core;
use App\Controllers;

const _DEFAULT_VIEW_NAME = 'home';
const _LEGACY_VIEW_NAME = 'index';
const _DEFAULT_ROUTE = new Core\Route(_DEFAULT_VIEW_NAME, new Controllers\HomeController());

const _URIS = [
    // Valid home uris
    '' => _DEFAULT_ROUTE,
    _DEFAULT_VIEW_NAME => _DEFAULT_ROUTE,
    _LEGACY_VIEW_NAME => _DEFAULT_ROUTE,
];

# Create Router singleton
const _ROUTER = new Core\Router();
_ROUTER->dispatch();
