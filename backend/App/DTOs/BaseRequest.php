<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Utils\TextUtils;

abstract readonly class BaseRequest extends BaseDto
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
            $array[$key] = static::unwrapValue(
                $value,
                onObject: static fn (mixed $obj) => $obj instanceof self
                    ? $obj->toUpdateArray()
                    : $obj
            );
        }

        return $array;
    }
}
