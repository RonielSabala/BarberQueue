<?php

declare(strict_types=1);

namespace App\Utils;

class TextUtils
{
    public static function removePrefix(string $text, string $prefix): string
    {
        if (!str_starts_with($text, $prefix)) {
            return $text;
        }

        return substr($text, \strlen($prefix));
    }

    public static function removeSuffix(string $text, string $suffix): string
    {
        if (!str_ends_with($text, $suffix)) {
            return $text;
        }

        return substr($text, 0, -\strlen($suffix));
    }

    public static function toSnakeCase(string $text): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $text));
    }

    public static function joinWithDot(string $a, string $b = '')
    {
        if ($a === '') {
            return $b;
        }

        return $a . '.' . $b;
    }
}
