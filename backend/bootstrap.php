<?php

declare(strict_types=1);

const ROOT_DIR = __DIR__ . '/..';
require_once ROOT_DIR . '/vendor/autoload.php';

use Dotenv\Dotenv;

Dotenv::createImmutable(ROOT_DIR)->load();
