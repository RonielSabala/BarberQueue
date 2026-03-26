<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\Base\BaseField;

abstract readonly class BaseResponse
{
    public static function fromEntity(BaseEntity $entity): static
    {
        $responseReflection = new \ReflectionClass(static::class);
        $constructor = $responseReflection->getConstructor();

        if (!$constructor) {
            return new static();
        }

        $entityReflection = new \ReflectionClass($entity);
        $args = [];

        foreach ($constructor->getParameters() as $param) {
            $name = $param->getName();

            if (!$entityReflection->hasProperty($name)) {
                $args[] = $param->isDefaultValueAvailable()
                    ? $param->getDefaultValue()
                    : null;

                continue;
            }

            $property = $entityReflection->getProperty($name);
            $value = $property->getValue($entity);
            $args[] = self::unwrapValue($value);
        }

        return $responseReflection->newInstanceArgs($args);
    }

    private static function unwrapValue(mixed $value): mixed
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof BaseField) {
            return $value->value;
        }

        // Unwrap array
        if (\is_array($value)) {
            return array_map(static fn (mixed $item) => self::unwrapValue($item), $value);
        }

        return $value;
    }
}
