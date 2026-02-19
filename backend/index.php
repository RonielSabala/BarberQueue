<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use App\Config\DbConfig;
use App\Controllers\BaseController;
use App\Core\{HttpStatus, Router};
use App\Middleware\CorsMiddleware;

CorsMiddleware::handle();

try {
    DbConfig::init();
} catch (\RuntimeException $e) {
    BaseController::json(['error' => 'Service unavailable'], HttpStatus::InternalServerError);
    exit;
}

Router::init();
Router::dispatch();
