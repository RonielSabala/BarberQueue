<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HeaderType;

class HealthController extends BaseController
{
    public function handle(): void
    {
        header(HeaderType::PlainText->header());
        http_response_code(200);
    }
}
