<?php

declare(strict_types=1);

namespace Config;

use App\Controllers;
use App\Core\Router;

// Home routes
const _DEFAULT_CONTROLLER = new Controllers\HomeController(viewTabName: 'home');
WebRoutes::add('', _DEFAULT_CONTROLLER);
WebRoutes::add(Router::LEGACY_VIEW_NAME, _DEFAULT_CONTROLLER);
WebRoutes::add(Router::DEFAULT_VIEW_NAME, _DEFAULT_CONTROLLER);

// Health route
WebRoutes::add('health', new Controllers\HealthController());
