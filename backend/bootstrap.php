<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use App\Core\Container;
use App\Services\Mail\{MailService, MailerInterface, MockMailService};
use App\Utils\EnvUtils;
use Dotenv\Dotenv;

const ROOT_DIR = __DIR__ . '/..';
Dotenv::createImmutable(ROOT_DIR)->load();

$isTest = (
    EnvUtils::get('APP_ENV', 'development') === 'testing'
    || ($_SERVER['HTTP_X_APP_ENV'] ?? '') === 'testing'
);

// Set timezone
date_default_timezone_set(EnvUtils::get('APP_TIMEZONE', 'UTC'));

// Bindings
$container = new Container();
$container->bind(
    MailerInterface::class,
    $isTest ? MockMailService::class : MailService::class
);
