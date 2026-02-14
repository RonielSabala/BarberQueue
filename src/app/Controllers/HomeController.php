<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Template;


class HomeController
{
    public function handle(Template $template)
    {
        $template->apply();
    }
}
