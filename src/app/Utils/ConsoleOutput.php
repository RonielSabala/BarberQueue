<?php

declare(strict_types=1);

namespace App\Utils;

enum Color: int
{
    case Red = 31;
    case Green = 32;
}

class ConsoleOutput
{
    private static function format(string $text, Color $color): string
    {
        return "\033[{$color->value}m{$text}\033[0m";
    }

    public static function error(string $text): string
    {
        return self::format($text, Color::Red);
    }

    public static function success(string $text): string
    {
        return self::format($text, Color::Green);
    }
}
