<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Attributes\ArrayOf;
use App\Domain\Entities\BaseEntity;

abstract readonly class BaseResponse extends BaseDto
{
    public static function fromEntity(BaseEntity $entity, array $overrides = []): static
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

            // Check manual overrides first
            if (\array_key_exists($name, $overrides)) {
                $args[] = $overrides[$name];
                continue;
            }

            // Check if the entity has the property
            if (!$entityReflection->hasProperty($name)) {
                $args[] = $param->isDefaultValueAvailable()
                    ? $param->getDefaultValue()
                    : null;

                continue;
            }

            // Extract and process value from entity
            $property = $entityReflection->getProperty($name);
            $value = $property->getValue($entity);

            $itemType = ArrayOf::fromParam($param)?->newInstance()?->type;

            // Handle recursive DTO mapping if the property is an array of sub-entities
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
