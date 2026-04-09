<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Domain\ValueObjects\Base\BaseField;

abstract readonly class BaseDto
{
    protected static function unwrapValue(mixed $value, ?callable $onObject = null): mixed
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof BaseField) {
            return $value->value;
        }

        if (\is_bool($value)) {
            return $value ? 1 : 0;
        }

        if (\is_array($value)) {
            return array_map(
                static fn (mixed $item) => static::unwrapValue($item, $onObject),
                $value
            );
        }

        if ($onObject !== null) {
            return $onObject($value);
        }

        return $value;
    }
}
