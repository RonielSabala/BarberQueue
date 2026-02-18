<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\View;

class LandingController extends BaseController
{
    public function handle(View $view): void
    {
        $view->Render();
    }
}
