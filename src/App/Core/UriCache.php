<?php

declare(strict_types=1);

namespace App\Core;

use App\Utils\UriUtils;

class UriCache
{
    private const MAX_CACHE = 5;
    private const SESSION_NAME = 'uriSession';
    private const WELL_KNOWN_URI = '/.well-known/appspecific/com.chrome.devtools.json';

    public static function init(): void
    {
        if (isset($_SESSION[self::SESSION_NAME]) && !empty($_SESSION[self::SESSION_NAME])) {
            return;
        }

        $_SESSION[self::SESSION_NAME] = [];
    }

    private static function count(): int
    {
        return \count($_SESSION[self::SESSION_NAME]);
    }

    private static function append(string $uri): void
    {
        $_SESSION[self::SESSION_NAME][] = $uri;
    }

    private static function limitCache(): void
    {
        $_SESSION[self::SESSION_NAME] = \array_slice($_SESSION[self::SESSION_NAME], -self::MAX_CACHE);
    }

    private static function getIthUri(int $i)
    {
        $count = self::count();
        if ($i < 0) {
            $i += $count;
        }

        if (abs($i) >= $count) {
            return '';
        }

        return $_SESSION[self::SESSION_NAME][$i];
    }

    private static function persistUri(string $uri): void
    {
        if ($uri === self::WELL_KNOWN_URI) {
            return;
        }

        if (self::count() === 0) {
            self::append($uri);
            return;
        }

        $current = UriUtils::removeUriParams($uri);
        $prev = UriUtils::removeUriParams(self::getIthUri(-1));
        if ($prev === $current) {
            return;
        }

        self::append($uri);
        self::limitCache();
    }

    public static function getCurrentUri(): string
    {
        $uri = $_SERVER['REQUEST_URI'];
        self::persistUri($uri);
        return UriUtils::parse($uri);
    }

    public static function getPreviousUri(): string
    {
        return self::getIthUri(-2);
    }
}
