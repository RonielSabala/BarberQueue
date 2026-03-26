<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Domain\ValueObjects\Base\BaseField;
use App\Utils\TextUtils;

abstract readonly class BaseRequest
{
    public function toUpdateArray(): array
    {
        $reflection = new \ReflectionClass($this);
        $properties = $reflection->getProperties(\ReflectionProperty::IS_PUBLIC);

        $array = [];
        foreach ($properties as $property) {
            $value = $property->getValue($this);
            if ($value === null) {
                continue;
            }

            $key = TextUtils::toSnakeCase($property->getName());
            $array[$key] = $this->parseValue($value);
        }

        return $array;
    }

    private function parseValue($value): mixed
    {
        return match (true) {
            $value instanceof BaseField => $value->value,
            $value instanceof self => $value->toUpdateArray(),
            \is_bool($value) => $value ? 1 : 0,
            default => $value,
        };
    }
}
