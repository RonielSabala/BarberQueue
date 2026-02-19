<?php

declare(strict_types=1);

namespace Config;

use App\Controllers;
use App\Controllers\Auth;
use App\Routing\RoutesCollection;

// Health
RoutesCollection::add('/health', new Controllers\HealthController());

// Landing
RoutesCollection::add('/landing', new Controllers\LandingController());

// Auth
RoutesCollection::add('/auth/login', new Auth\LoginController());
RoutesCollection::add('/auth/signup', new Auth\SignupController());
RoutesCollection::add('/auth/forgot-password', new Auth\ForgotPasswordController());
RoutesCollection::add('/auth/reset-password', new Auth\ResetPasswordController());
