<?php

declare(strict_types=1);

namespace App\Utils;

final readonly class EnvUtils
{
    public static function get(string $variableName, ?string $fallback = null): string
    {
        $value = $_ENV[$variableName] ?? $fallback;
        if ($value === null) {
            throw new \RuntimeException("`{$variableName}` is not defined in the environment.");
        }

        return $value;
    }
}
