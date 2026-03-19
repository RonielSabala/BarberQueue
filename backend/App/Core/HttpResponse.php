<?php

declare(strict_types=1);

namespace App\Core;

use App\Attributes\JsonIgnore;
use App\Domain\ValueObjects\BaseField;

class HttpResponse
{
    private static function filterForJson(mixed $data): mixed
    {
        if (\is_array($data)) {
            $result = [];
            foreach ($data as $key => $value) {
                $result[$key] = self::filterForJson($value);
            }

            return $result;
        }

        if (!\is_object($data)) {
            return $data;
        }

        if ($data instanceof BaseField) {
            return $data->value;
        }

        $result = [];
        $reflection = new \ReflectionClass($data);

        foreach ($reflection->getProperties() as $prop) {
            if ($prop->getAttributes(JsonIgnore::class)) {
                continue;
            }

            // Get the value and recursively filter it
            $val = $prop->getValue($data);
            $result[$prop->getName()] = self::filterForJson($val);
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
}
