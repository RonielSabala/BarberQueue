<?php

declare(strict_types=1);

const ROOT_DIR = __DIR__ . '/..';
require_once ROOT_DIR . '/vendor/autoload.php';

use Config\DbConfig;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(ROOT_DIR);
$dotenv->safeLoad();

DbConfig::init();
