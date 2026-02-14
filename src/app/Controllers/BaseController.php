<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Template;

abstract class BaseController
{
    abstract public function handle(Template $template): void;
}
