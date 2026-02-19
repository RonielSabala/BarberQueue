<?php

declare(strict_types=1);

namespace App\Utils;

class UriUtils
{
    public static function removeUriParams(string $uri): string
    {
        return explode('?', $uri)[0];
    }

    public static function parse(string $uri): string
    {
        $parsedUri = parse_url($uri, PHP_URL_PATH);
        return trim($parsedUri, '/');
    }

    public static function getViewParts(string $viewRoute): array
    {
        $parts = explode('/', $viewRoute);
        if (\count($parts) === 1) {
            return ['', $viewRoute];
        }

        $viewDir = implode('/', \array_slice($parts, 0, -1));
        $viewName = end($parts);
        return [$viewDir, $viewName];
    }
}
