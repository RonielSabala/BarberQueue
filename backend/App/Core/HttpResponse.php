<?php

declare(strict_types=1);

namespace App\Core;

class HttpResponse
{
    private static function filterForJson(mixed $data): mixed
    {
        if (\is_array($data)) {
            return array_map(self::filterForJson(...), $data);
        }

        if (!\is_object($data)) {
            return $data;
        }

        $result = [];
        $reflection = new \ReflectionClass($data);

        foreach ($reflection->getProperties(\ReflectionProperty::IS_PUBLIC) as $prop) {
            $result[$prop->getName()] = self::filterForJson($prop->getValue($data));
        }

        return $result;
    }

    public static function json(
        mixed $data,
        HttpStatus $status = HttpStatus::Ok,
        HttpHeader $header = HttpHeader::Json
    ): void {
        $data = self::filterForJson($data);
        $status->response();
        if ($status === HttpStatus::NoContent) {
            return;
        }

        $header->send();
        $data = self::filterForJson($data);
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
}
