<?php

declare(strict_types=1);

namespace App\Core;

class HttpResponse
{
    public static function json(
        mixed $data,
        HttpStatus $status = HttpStatus::Ok,
        HttpHeader $header = HttpHeader::Json
    ): void {
        $status->response();
        $header->send();
        echo json_encode($data);
    }

    public static function success(
        string $message,
        HttpHeader $header = HttpHeader::Json
    ): void {
        self::json(['message' => $message], HttpStatus::Ok, $header);
    }

    public static function error(
        string $message,
        HttpStatus $status,
    ): void {
        self::json(['error' => $message], $status, HttpHeader::Json);
    }

    public static function fromException(\RuntimeException $exception): void
    {
        self::error($exception->getMessage(), HttpStatus::from($exception->getCode()));
    }
}
