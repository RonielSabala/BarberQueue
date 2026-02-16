<?php

declare(strict_types=1);

namespace App\Utils;

class UriCache
{
    private const MAX_CACHE = 5;
    private const SESSION_NAME = 'uriCache';
    private const WELL_KNOWN_URI = '/.well-known/appspecific/com.chrome.devtools.json';

    public static function start(): void
    {
        // Start history if inactive
        if (isset($_SESSION[self::SESSION_NAME])) {
            return;
        }

        $_SESSION[self::SESSION_NAME] = [];
    }

    public static function count(): int
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

    public static function getIthUri(int $i)
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

    public static function persistUri(string $uri): void
    {
        if ($uri === self::WELL_KNOWN_URI) {
            return;
        }

        if (self::count() === 0) {
            self::append($uri);
            return;
        }

        [$view_path, $view_name] = UriUtils::split($uri);
        [$last_view_path, $last_view_name] = UriUtils::split(self::getIthUri(-1));

        $last = UriUtils::getCleanUri($last_view_path, $last_view_name);
        $current = UriUtils::getCleanUri($view_path, $view_name);
        if ($current === $last) {
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
