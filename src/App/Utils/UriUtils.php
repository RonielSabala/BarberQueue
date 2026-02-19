<?php

declare(strict_types=1);

namespace App\Utils;

class UriUtils
{
    public static function parse(string $uri): string
    {
        $parsedUri = parse_url($uri, PHP_URL_PATH);
        return trim($parsedUri, '/');
    }

    public static function getCurrentUri(): string
    {
        $uri = $_SERVER['REQUEST_URI'];
        return self::parse($uri);
    }

    public static function removeUriParams(string $uri): string
    {
        return explode('?', $uri)[0];
    }
}
