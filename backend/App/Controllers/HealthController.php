<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\GET;
use App\Core\{HttpHeader, HttpResponse};

final readonly class HealthController extends BaseController
{
    #[GET('/api/health')]
    public function get(): void
    {
        HttpResponse::success('OK', HttpHeader::PlainText);
    }
}
