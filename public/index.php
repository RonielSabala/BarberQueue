<?php

declare(strict_types=1);

define('PUBLIC_DIR', __DIR__);

require_once __DIR__ . '/../src/bootstrap.php';

use App\Core\Router;

(new Router())->dispatch();
