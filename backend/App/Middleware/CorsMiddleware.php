<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\HttpStatus;
use App\Utils\EnvUtils;

class CorsMiddleware
{
    public static function handle(): void
    {
        header('Access-Control-Allow-Origin: ' . EnvUtils::get('FRONTEND_URL'));
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            HttpStatus::NoContent->response();
            exit;
        }
    }
}
