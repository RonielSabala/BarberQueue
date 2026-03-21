<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HttpStatus;
use App\DTOs\BaseRequest;
use App\Exceptions\ValidationException;

abstract class BaseController
{
    public static function mapToRequest(string $requestClass): object
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
        foreach ($constructor->getParameters() as $param) {
            $args[] = self::resolveParam($param, $param->getType(), $data, $path);
        }

        return $reflection->newInstanceArgs($args);
    }

    private static function resolveParam(
        \ReflectionParameter $param,
        ?\ReflectionType $type,
        array $data,
        string $path
    ): mixed {
        $name = $param->getName();
        $fullPath = $path !== '' ? "{$path}.{$name}" : $name;
        $allowsNull = $type?->allowsNull() ?? true;

        if (!\array_key_exists($name, $data)) {
            if ($param->isDefaultValueAvailable()) {
                return $param->getDefaultValue();
            }

            if ($allowsNull) {
                return null;
            }

            throw new ValidationException("Field '{$fullPath}' is required", HttpStatus::BadRequest);
        }

        $value = $data[$name];
        if ($value === null) {
            if ($allowsNull) {
                return null;
            }

            throw new ValidationException("Field '{$fullPath}' cannot be null", HttpStatus::BadRequest);
        }

        if (!$type instanceof \ReflectionNamedType || $type->isBuiltin()) {
            return $value;
        }

        $className = $type->getName();

        // Value Object
        if (!is_subclass_of($className, BaseRequest::class)) {
            return new $className($value);
        }

        if (!\is_array($value)) {
            throw new ValidationException("Field '{$fullPath}' must be an object", HttpStatus::BadRequest);
        }

        // Nested request
        return self::mapFromArray($className, $value, $fullPath);
    }
}
