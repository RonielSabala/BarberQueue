<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use App\Core\Router;
use App\Middleware\CorsMiddleware;

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

(new Router())->dispatch();
CorsMiddleware::handle();
