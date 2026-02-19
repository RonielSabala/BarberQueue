<?php

declare(strict_types=1);

define('SRC_DIR', __DIR__);

require_once SRC_DIR . '/../vendor/autoload.php';

use App\Core\UriCache;
use Config\DbConfig;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

DbConfig::init();
UriCache::init();
