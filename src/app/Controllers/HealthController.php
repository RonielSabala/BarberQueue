<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Template;
use App\Domain\HeaderType;
use App\Controllers\Core\BaseController;

class HealthController extends BaseController
{
    public function handle(Template $template): void
    {
        header(HeaderType::PlainText->header());
        http_response_code(200);

        $template->apply();
    }
}
