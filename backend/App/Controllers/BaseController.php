<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Attributes\ArrayOf;
use App\Core\HttpStatus;
use App\DTOs\BaseRequest;
use App\Exceptions\Base\{ValidationException, ValueObjectException};
use App\Utils\{TextUtils, TypeCoercion};

abstract readonly class BaseController
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
            $fieldName = $param->getName();
            $fieldType = $param->getType();
            $fieldPath = TextUtils::joinWithDot($path, $fieldName);
            $expectedKeys[] = $fieldName;

            $value = self::extractValue($param, $fieldType, $fieldName, $fieldPath, $data);
            $args[] = self::resolveParam($param, $fieldType, $value, $fieldPath);
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
        \ReflectionParameter $param,
        \ReflectionNamedType $fieldType,
        mixed $value,
        string $fieldPath
    ): mixed {
        if ($value === null) {
            return null;
        }

        $isReflectionType = $fieldType instanceof \ReflectionNamedType;
        if ($isReflectionType && $fieldType->getName() === 'array') {
            return self::resolveArray($param, $value, $fieldPath);
        }

        if (!$isReflectionType || $fieldType->isBuiltin()) {
            return $value;
        }

        $className = $fieldType->getName();

        // Value Object
        if (!is_subclass_of($className, BaseRequest::class)) {
            try {
                return new $className(self::coerceForValueObject($className, $value));
            } catch (ValueObjectException $e) {
                throw new ValidationException(
                    "'{$fieldPath}' {$e->getMessage()}",
                    HttpStatus::UnprocessableEntity
                );
            }
        }

        if (!\is_array($value)) {
            throw new ValidationException(
                "Field '{$fieldPath}' must be an object",
                HttpStatus::BadRequest
            );
        }

        // Nested request
        return self::mapFromArray($className, $value, $fieldPath);
    }

    private static function resolveArray(
        \ReflectionParameter $param,
        mixed $value,
        string $fieldPath
    ): mixed {
        $arrayOf = ArrayOf::fromParam($param);
        if ($arrayOf === null) {
            // Plain array with no attribute
            return $value;
        }

        if (!\is_array($value)) {
            throw new ValidationException(
                "Field '{$fieldPath}' must be an array",
                HttpStatus::BadRequest
            );
        }

        $instance = $arrayOf->newInstance();
        $minItems = $instance->minItems;
        $maxItems = $instance->maxItems;
        $itemsCount = \count($value);

        if ($minItems !== null && $itemsCount < $minItems) {
            throw new ValidationException(
                "Field '{$fieldPath}[]' must have at least {$minItems} item(s)",
                HttpStatus::BadRequest
            );
        }

        if ($maxItems !== null && $itemsCount > $maxItems) {
            throw new ValidationException(
                "Field '{$fieldPath}[]' must have at most {$maxItems} item(s)",
                HttpStatus::BadRequest
            );
        }

        $itemType = $instance->type;
        return array_map(
            static function (mixed $item) use ($itemType, $fieldPath): mixed {
                if (!is_subclass_of($itemType, BaseRequest::class)) {
                    return new $itemType($item);
                }

                if (!\is_array($item)) {
                    throw new ValidationException(
                        "Field '{$fieldPath}' must be an array",
                        HttpStatus::BadRequest
                    );
                }

                return self::mapFromArray($itemType, $item, $fieldPath);
            },
            $value
        );
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
