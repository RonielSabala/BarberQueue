<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HttpStatus;
use App\DTOs\BaseRequest;
use App\Exceptions\ValidationException;

abstract class BaseController
{
    public static function buildRequest(string $requestClass): object
    {
        return self::mapFromArray($requestClass, self::getJsonBody());
    }

    private static function getJsonBody(): array
    {
        $raw = file_get_contents('php://input');
        return json_decode($raw ?: '', true) ?? [];
    }

    private static function joinWithDot(string $a, string $b = '')
    {
        if ($a === '') {
            return $b;
        }

        return $a . '.' . $b;
    }

    private static function mapFromArray(string $requestClass, array $data, string $path = ''): object
    {
        $reflection = new \ReflectionClass($requestClass);
        $constructor = $reflection->getConstructor();

        if (!$constructor) {
            return new $requestClass();
        }

        $args = [];
        $expectedKeys = [];

        foreach ($constructor->getParameters() as $param) {
            $args[] = self::resolveParam($param, $data, $path);
            $expectedKeys[] = $param->getName();
        }

        $unexpectedKeys = array_diff(array_keys($data), $expectedKeys);
        if (!empty($unexpectedKeys)) {
            $prefix = self::joinWithDot($path);
            $fields = implode(', ', array_map(static fn ($k) => "'{$prefix}{$k}'", $unexpectedKeys));
            throw new ValidationException("Unexpected field(s): {$fields}", HttpStatus::BadRequest);
        }

        return $reflection->newInstanceArgs($args);
    }

    private static function resolveParam(
        \ReflectionParameter $param,
        array $data,
        string $path
    ): mixed {
        $fieldName = $param->getName();
        $fieldType = $param->getType();
        $fieldPath = self::joinWithDot($path, $fieldName);
        $allowsNull = $fieldType?->allowsNull() ?? true;

        if (!\array_key_exists($fieldName, $data)) {
            if ($param->isDefaultValueAvailable()) {
                return $param->getDefaultValue();
            }

            if ($allowsNull) {
                return null;
            }

            throw new ValidationException("Field '{$fieldPath}' is required", HttpStatus::BadRequest);
        }

        $value = $data[$fieldName];
        if ($value === null) {
            if ($allowsNull) {
                return null;
            }

            throw new ValidationException("Field '{$fieldPath}' cannot be null", HttpStatus::BadRequest);
        }

        if (!$fieldType instanceof \ReflectionNamedType || $fieldType->isBuiltin()) {
            return $value;
        }

        $className = $fieldType->getName();

        // Value Object
        if (!is_subclass_of($className, BaseRequest::class)) {
            return new $className($value);
        }

        if (!\is_array($value)) {
            throw new ValidationException("Field '{$fieldPath}' must be an object", HttpStatus::BadRequest);
        }

        // Nested request
        return self::mapFromArray($className, $value, $fieldPath);
    }
}
