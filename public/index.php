<?php

declare(strict_types=1);

define('PUBLIC_DIR', __DIR__);

require_once __DIR__ . '/../bootstrap.php';

use App\Core\Router;

const _ROUTER = new Router();
_ROUTER->dispatch();
