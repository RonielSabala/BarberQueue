<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Controllers\Core\Controller;
use App\Core\View;

class HomeController extends Controller
{
    public function handle(View $view): void
    {
        $view->Render();
    }
}
