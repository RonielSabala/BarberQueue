<?php

declare(strict_types=1);

namespace App\Utils;

class UriUtils
{
    public static function getCurrentUri(): string
    {
        $uri = $_SERVER['REQUEST_URI'];
        return parse_url($uri, PHP_URL_PATH);
    }
}
