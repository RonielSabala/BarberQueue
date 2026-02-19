<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\GET;
use App\Core\{HttpHeader, HttpResponse};

class HealthController extends BaseController
{
    #[GET('/api/health')]
    public function get(): void
    {
        HttpResponse::success(header: HttpHeader::PlainText);
    }
}
