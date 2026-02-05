<?php

namespace App\Utils;


class UriUtils
{
    public static function split(string $uri): array
    {
        $uriParts = explode('/', $uri);
        if (count($uriParts) == 1) {
            return ['', $uri];
        }

        $uri = implode('/', array_slice($uriParts, 0, -1));
        $view = end($uriParts);
        return [$uri, $view];
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
