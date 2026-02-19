<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HeaderType;

abstract class BaseController
{
    public HeaderType $contentType = HeaderType::Json;

    protected function success(string $message = 'OK'): void
    {
        $this->json(['message' => $message], 200);
    }

    protected function notFound(string $message = 'Not found'): void
    {
        $this->json(['error' => $message], 404);
    }

    protected function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header($this->contentType->header());
        echo json_encode($data);
    }
}
