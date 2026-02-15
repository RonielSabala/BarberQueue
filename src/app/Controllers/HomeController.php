<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Controllers\Core\Controller;
use App\Core\Template;

class HomeController extends Controller
{
    public function handle(Template $template): void
    {
        $template->apply();
    }
}
