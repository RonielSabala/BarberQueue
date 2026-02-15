<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Controllers\Core\Controller;
use App\Core\Template;
use App\Domain\HeaderType;

class HealthController extends Controller
{
    public function handle(Template $template): void
    {
        header(HeaderType::PlainText->header());
        http_response_code(200);

        $template->apply();
    }
}
