<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use App\Config\{DbConfig, LoggerProvider};
use App\Core\{HttpResponse, HttpStatus, Router};
use App\Middleware\CorsMiddleware;

CorsMiddleware::handle();

try {
    // Connect to the correct database
    DbConfig::init(isTest: $isTest);
} catch (\RuntimeException $e) {
    LoggerProvider::get()->critical($e->getMessage(), [
        'exception' => $e,
    ]);

    HttpResponse::error('Service unavailable', HttpStatus::InternalServerError);
    exit;
}

Router::init($container);
Router::dispatch();
