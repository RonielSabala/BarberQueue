<?php

declare(strict_types=1);

namespace Config;

use App\Controllers;
use App\Core\Router;

// Home routes
const _DEFAULT_CONTROLLER = new Controllers\HomeController(viewTabName: 'home');
RoutesCollection::add('', _DEFAULT_CONTROLLER);
RoutesCollection::add(Router::LEGACY_VIEW_NAME, _DEFAULT_CONTROLLER);
RoutesCollection::add(Router::DEFAULT_VIEW_NAME, _DEFAULT_CONTROLLER);

// Health route
RoutesCollection::add('health', new Controllers\HealthController());
