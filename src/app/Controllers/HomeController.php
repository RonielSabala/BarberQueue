<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Controllers\Core\BaseController;
use App\Core\Template;

class HomeController extends BaseController
{
    public function handle(Template $template): void
    {
        $template->apply();
    }
}
