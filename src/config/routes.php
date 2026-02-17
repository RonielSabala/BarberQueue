<?php

declare(strict_types=1);

use App\Controllers;
use App\Core\WebRoutes;

const LEGACY_VIEW_NAME = 'index';
const DEFAULT_VIEW_NAME = 'home';
const _DEFAULT_CONTROLLER = new Controllers\HomeController(viewTabName: 'home');

// Home routes
WebRoutes::add('', _DEFAULT_CONTROLLER);
WebRoutes::add(LEGACY_VIEW_NAME, _DEFAULT_CONTROLLER);
WebRoutes::add(DEFAULT_VIEW_NAME, _DEFAULT_CONTROLLER);

// Health route
WebRoutes::add('health', new Controllers\HealthController());
