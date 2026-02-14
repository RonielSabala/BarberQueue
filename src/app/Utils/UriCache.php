<?php

declare(strict_types=1);

namespace App\Utils;

class UriCache
{
    private const MAX_CACHE = 5;
    private const VAR_NAME = 'uri_cache';
    private const WELL_KNOWN_URI = '/.well-known/appspecific/com.chrome.devtools.json';

    public static function start(): void
    {
        // Start history if inactive
        if (isset($_SESSION[self::VAR_NAME])) {
            return;
        }

        $_SESSION[self::VAR_NAME] = [];
    }

    public static function count(): int
    {
        return count($_SESSION[self::VAR_NAME]);
    }

    private static function _append(string $uri): void
    {
        $_SESSION[self::VAR_NAME][] = $uri;
    }

    private static function limitCache(): void
    {
        $_SESSION[self::VAR_NAME] = array_slice($_SESSION[self::VAR_NAME], -self::MAX_CACHE);
    }

    public static function getIthUri(int $i)
    {
        $count = self::count();
        if ($i < 0) {
            $i += $count;
        }

        $lastUri = '';
        if ($count > abs($i)) {
            $lastUri = $_SESSION[self::VAR_NAME][$i];
        }

        return $lastUri;
    }

    public static function append(string $uri): void
    {
        if ($uri === self::WELL_KNOWN_URI) {
            return;
        }

        if (self::count() === 0) {
            self::_append($uri);
            return;
        }

        [$view_path, $view_name] = UriUtils::split($uri);
        [$last_view_path, $last_view_name] = UriUtils::split(self::getIthUri(-1));

        $last = UriUtils::getCleanUri($last_view_path, $last_view_name);
        $current = UriUtils::getCleanUri($view_path, $view_name);
        if ($current === $last) {
            return;
        }

        self::_append($uri);
        self::limitCache();
    }

    public static function getCurrentUri(): string
    {
        $uri = $_SERVER['REQUEST_URI'];
        self::append($uri);
        return UriUtils::parse($uri);
    }
}
