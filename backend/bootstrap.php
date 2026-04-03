<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use App\Core\Container;
use App\Services\Mail\{MailService, MailerInterface, MockMailService};
use Dotenv\Dotenv;

const ROOT_DIR = __DIR__ . '/..';
Dotenv::createImmutable(ROOT_DIR)->load();

// Set timezone
date_default_timezone_set($_ENV['APP_TIMEZONE'] ?? 'UTC');

// Bindings

$isTest = (
    ($_ENV['APP_ENV'] ?? 'development') === 'testing'
    || ($_SERVER['HTTP_X_APP_ENV'] ?? '') === 'testing'
);

$container = new Container();
$container->bind(
    MailerInterface::class,
    $isTest ? MockMailService::class : MailService::class
);
