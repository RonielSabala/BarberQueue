<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Attributes\ArrayOf;
use App\Domain\Entities\BaseEntity;

abstract readonly class BaseResponse extends BaseDto
{
    public static function fromEntity(BaseEntity $entity): static
    {
        $reflection = new \ReflectionClass(static::class);
        $constructor = $reflection->getConstructor();

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

            $arrayOf = $param->getAttributes(ArrayOf::class)[0] ?? null;
            $itemType = $arrayOf?->newInstance()?->type;

            $onObject = ($itemType !== null && is_subclass_of($itemType, self::class))
                ? static fn (mixed $item) => $itemType::fromEntity($item)
                : null;

            $args[] = static::unwrapValue($value, $onObject);
        }

        return $reflection->newInstanceArgs($args);
    }

    /** @return static[] */
    public static function fromEntities(array $entities): array
    {
        return array_map(
            static fn ($entity) => self::fromEntity($entity),
            $entities
        );
    }
}
