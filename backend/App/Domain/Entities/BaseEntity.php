<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Attributes\ArrayOf;
use App\Utils\TextUtils;

readonly class BaseEntity
{
    public static function fromDbRow(array $row): self
    {
        $reflection = new \ReflectionClass(static::class);
        $constructor = $reflection->getConstructor();

        if (!$constructor) {
            return new static();
        }

        $arguments = [];
        foreach ($constructor->getParameters() as $param) {
            $dbKey = TextUtils::toSnakeCase($param->getName());
            $dbValue = $row[$dbKey] ?? null;
            $valueExists = $dbValue !== null;
            $type = $param->getType();

            $arrayOf = ArrayOf::fromParam($param);
            if ($arrayOf !== null) {
                $itemType = $arrayOf->newInstance()->type;
                $items = $valueExists
                    ? array_map('trim', explode(',', (string) $dbValue))
                    : [];

                $arguments[] = array_map(
                    static fn (string $item) => new $itemType($item),
                    $items
                );

                continue;
            }

            // Value Object
            if (
                $valueExists
                && $type instanceof \ReflectionNamedType
                && !$type->isBuiltin()
            ) {
                $className = $type->getName();
                $arguments[] = new $className($dbValue);
                continue;
            }

            $arguments[] = $dbValue;
        }

        return $reflection->newInstanceArgs($arguments);
    }
}
