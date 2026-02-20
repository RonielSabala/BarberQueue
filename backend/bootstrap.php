<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

const ROOT_DIR = __DIR__ . '/..';
Dotenv::createImmutable(ROOT_DIR)->load();
