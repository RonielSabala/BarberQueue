<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\{HeaderType, View};

class HealthController extends BaseController
{
    public function handle(View $view): void
    {
        header(HeaderType::PlainText->header());
        http_response_code(200);
        $view->render();
    }
}
