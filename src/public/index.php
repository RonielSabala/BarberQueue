<?php

declare(strict_types=1);

const PUBLIC_DIR = __DIR__;
const SRC_DIR = PUBLIC_DIR . '/..';

require_once SRC_DIR . '/../vendor/autoload.php';

use App\Core\Router;
use Config\DbConfig;

DbConfig::init();

const _ROUTER = new Router();
_ROUTER->dispatch();
