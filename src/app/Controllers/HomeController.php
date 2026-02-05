<?php

namespace App\Controllers;

use App\Core\Template;


class HomeController
{
    public function handle(Template $template)
    {
        $template->apply();
    }
}
