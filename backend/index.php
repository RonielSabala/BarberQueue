<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use App\Config\{DbConfig, LoggerProvider};
use App\Core\{HttpResponse, HttpStatus, Router};
use App\Middleware\CorsMiddleware;

CorsMiddleware::handle();

try {
    DbConfig::init();
} catch (\RuntimeException $e) {
    LoggerProvider::get()->critical($e->getMessage(), [
        'exception' => $e,
    ]);

    HttpResponse::error('Service unavailable', HttpStatus::InternalServerError);
    exit;
}

Router::init();
Router::dispatch();
