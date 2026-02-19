<?php

declare(strict_types=1);

namespace App\Core;

class HttpResponse
{
    public static function success(
        string $message = 'OK',
        HeaderType $header = HeaderType::Json
    ): void {
        self::json(
            ['message' => $message],
            HttpStatus::Ok,
            $header
        );
    }

    public static function notFound(
        string $message = 'Not found',
        HeaderType $header = HeaderType::Json
    ): void {
        self::json(
            ['error' => $message],
            HttpStatus::NotFound,
            $header
        );
    }

    public static function serverError(
        string $message = 'Service unavailable',
        HeaderType $header = HeaderType::Json
    ): void {
        self::json(
            ['error' => $message],
            HttpStatus::InternalServerError,
            $header
        );
    }

    public static function json(
        mixed $data,
        HttpStatus $status = HttpStatus::Ok,
        HeaderType $header = HeaderType::Json
    ): void {
        $status->response();
        header($header->header());
        echo json_encode($data);
    }
}
