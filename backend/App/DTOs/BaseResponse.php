<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Domain\Entities\BaseEntity;

readonly class BaseResponse
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

            $args[] = $entityReflection->hasProperty($name)
                ? $entityReflection->getProperty($name)->getValue($entity)->value
                : ($param->isDefaultValueAvailable() ? $param->getDefaultValue() : null);
        }

        return $responseReflection->newInstanceArgs($args);
    }
}
