<?php

declare(strict_types=1);

namespace App\Utils;

class UriUtils
{
    public static function split(string $viewDir): array
    {
        $uriParts = explode('/', $viewDir);
        if (count($uriParts) === 1) {
            return ['', $viewDir];
        }

        $viewDir = implode('/', array_slice($uriParts, 0, -1));
        $viewFile = end($uriParts);
        return [$viewDir, $viewFile];
    }

    public static function getCleanUri(string $uri, string $view): string
    {
        return $uri . '/' . explode('?', $view)[0];
    }

    public static function parse(string $uri): string
    {
        $parsedUri = parse_url($uri, PHP_URL_PATH);
        return trim($parsedUri, '/');
    }
}
