<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HttpStatus;
use App\Exceptions\ValidationException;

abstract class BaseController
{
    private function getJsonBody(): array
    {
        $raw = file_get_contents('php://input');
        return json_decode($raw ?: '', true) ?? [];
    }

    protected function mapToRequest(string $requestClass): object
    {
        $reflection = new \ReflectionClass($requestClass);
        $constructor = $reflection->getConstructor();

        if (!$constructor) {
            return new $requestClass();
        }

        $args = [];
        $body = $this->getJsonBody();

        foreach ($constructor->getParameters() as $param) {
            $name = $param->getName();
            $type = $param->getType();

            // Determine if the parameter is optional or nullable
            $allowsNull = $type?->allowsNull() ?? true;
            $hasDefault = $param->isDefaultValueAvailable();

            // The field is missing from the JSON body
            if (!\array_key_exists($name, $body)) {
                if ($hasDefault) {
                    $args[] = $param->getDefaultValue();
                    continue;
                }

                if ($allowsNull) {
                    $args[] = null;
                    continue;
                }

                throw new ValidationException("Field '{$name}' is required", HttpStatus::BadRequest);
            }

            $value = $body[$name];

            // The field is present but is explicitly null
            if ($value === null) {
                if ($allowsNull) {
                    $args[] = null;
                    continue;
                }

                throw new ValidationException("Field '{$name}' cannot be null", HttpStatus::BadRequest);
            }

            // Handle Value Object instantiation
            if ($type instanceof \ReflectionNamedType && !$type->isBuiltin()) {
                $className = $type->getName();
                $args[] = new $className($value);
            } else {
                $args[] = $value;
            }
        }

        return $reflection->newInstanceArgs($args);
    }
}
