<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\{HeaderType, HttpStatus};

abstract class BaseController
{
    public static HeaderType $contentType = HeaderType::Json;

    public static function success(string $message = 'OK'): void
    {
        self::json(['message' => $message], HttpStatus::Ok);
    }

    public static function notFound(string $message = 'Not found'): void
    {
        self::json(['error' => $message], HttpStatus::NotFound);
    }

    public static function json(mixed $data, HttpStatus $status): void
    {
        $status->response();
        header(self::$contentType->header());
        echo json_encode($data);
    }
}
