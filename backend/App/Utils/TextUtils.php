<?php

declare(strict_types=1);

namespace App\Utils;

class TextUtils
{
    public static function escape(string $text): string
    {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }

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

    public static function hyphenToUnderscore(string $uri): string
    {
        return str_replace('-', '_', $uri);
    }

    public static function toTitleCase(string $text): string
    {
        return mb_convert_case($text, MB_CASE_TITLE, 'UTF-8');
    }
}
