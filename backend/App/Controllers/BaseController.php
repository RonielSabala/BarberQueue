<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HttpStatus;
use App\DTOs\BaseRequest;
use App\Exceptions\ValidationException;
use App\Utils\{TextUtils, TypeCoercion};

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
            $fieldType = $param->getType();
            $fieldName = $param->getName();
            $fieldPath = TextUtils::joinWithDot($path, $fieldName);
            $expectedKeys[] = $fieldName;

            $value = self::extractValue($param, $fieldType, $fieldName, $fieldPath, $data);
            $args[] = self::resolveParam($fieldType, $fieldPath, $value);
        }

        $unexpectedKeys = array_diff(array_keys($data), $expectedKeys);
        if (!empty($unexpectedKeys)) {
            $prefix = TextUtils::joinWithDot($path);
            $fields = implode(', ', array_map(static fn ($k) => "'{$prefix}{$k}'", $unexpectedKeys));
            throw new ValidationException("Unexpected field(s): {$fields}", HttpStatus::BadRequest);
        }

        return $reflection->newInstanceArgs($args);
    }

    private static function extractValue(
        \ReflectionParameter $param,
        \ReflectionNamedType $fieldType,
        string $fieldName,
        string $fieldPath,
        array $data
    ): mixed {
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
        if ($value === null && !$allowsNull) {
            throw new ValidationException("Field '{$fieldPath}' cannot be null", HttpStatus::BadRequest);
        }

        return $value;
    }

    private static function resolveParam(
        \ReflectionNamedType $fieldType,
        string $fieldPath,
        mixed $value
    ): mixed {
        if ($value === null) {
            return null;
        }

        if (!$fieldType instanceof \ReflectionNamedType || $fieldType->isBuiltin()) {
            return $value;
        }

        $className = $fieldType->getName();

        // Value Object
        if (!is_subclass_of($className, BaseRequest::class)) {
            return new $className(self::coerceForValueObject($className, $value));
        }

        if (!\is_array($value)) {
            throw new ValidationException("Field '{$fieldPath}' must be an object", HttpStatus::BadRequest);
        }

        // Nested request
        return self::mapFromArray($className, $value, $fieldPath);
    }

    private static function coerceForValueObject(string $className, mixed $value): mixed
    {
        $constructor = (new \ReflectionClass($className))->getConstructor();
        if (!$constructor) {
            return $value;
        }

        $firstParam = $constructor->getParameters()[0] ?? null;
        if (!$firstParam) {
            return $value;
        }

        $type = $firstParam->getType();
        if (!$type instanceof \ReflectionNamedType || !$type->isBuiltin()) {
            return $value;
        }

        return TypeCoercion::coerce($value, $type->getName());
    }
}
