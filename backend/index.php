<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use App\Config\DbConfig;
use App\Core\{HttpResponse, Router};
use App\Middleware\CorsMiddleware;

CorsMiddleware::handle();

try {
    DbConfig::init();
} catch (\RuntimeException $e) {
    HttpResponse::serverError();
    exit;
}

Router::init();
Router::dispatch();
