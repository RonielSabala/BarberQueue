<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\GET;
use App\Core\HeaderType;

class HealthController extends BaseController
{
    public HeaderType $contentType = HeaderType::PlainText;

    #[GET('/api/health')]
    public function get(): void
    {
        $this->success();
    }
}
