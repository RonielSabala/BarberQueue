<?php

declare(strict_types=1);

namespace App\Core;

class HttpResponse
{
    public static function success(
        string $message = 'OK',
        HttpHeader $header = HttpHeader::Json
    ): void {
        self::json(
            ['message' => $message],
            HttpStatus::Ok,
            $header
        );
    }

    public static function notFound(
        string $message = 'Not found'
    ): void {
        self::json(['error' => $message], HttpStatus::NotFound);
    }

    public static function serverError(
        string $message = 'Service unavailable'
    ): void {
        self::json(['error' => $message], HttpStatus::InternalServerError);
    }

    public static function json(
        mixed $data,
        HttpStatus $status = HttpStatus::Ok,
        HttpHeader $header = HttpHeader::Json
    ): void {
        $status->response();
        $header->header();
        echo json_encode($data);
    }
}
