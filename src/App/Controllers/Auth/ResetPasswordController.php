<?php

declare(strict_types=1);

namespace App\Controllers\Auth;

use App\Controllers\BaseController;
use App\Core\View;

class ResetPasswordController extends BaseController
{
    public function handle(View $view): void
    {
        $view->Render();
    }
}
