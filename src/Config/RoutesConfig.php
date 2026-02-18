<?php

declare(strict_types=1);

namespace Config;

use App\Controllers;
use App\Controllers\Auth;
use App\Core\Router;
use App\Routing\RoutesCollection;

// Home
const _DEFAULT_CONTROLLER = new Controllers\HomeController(viewTabName: 'home');
RoutesCollection::add('', _DEFAULT_CONTROLLER);
RoutesCollection::add(Router::LEGACY_VIEW_NAME, _DEFAULT_CONTROLLER);
RoutesCollection::add(Router::DEFAULT_VIEW_NAME, _DEFAULT_CONTROLLER);

// Health
RoutesCollection::add('health', new Controllers\HealthController());

// Landing
RoutesCollection::add('start/landing', new Controllers\LandingController());

// Auth
RoutesCollection::add('start/auth/login', new Auth\LoginController());
RoutesCollection::add('start/auth/signup', new Auth\SignupController());
RoutesCollection::add('start/auth/forgot-password', new Auth\ForgotPasswordController());
RoutesCollection::add('start/auth/reset-password', new Auth\ResetPasswordController());
