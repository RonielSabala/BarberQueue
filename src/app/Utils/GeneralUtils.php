<?php

declare(strict_types=1);

namespace App\Utils;


class GeneralUtils
{
    public static function removePrefix(string $text, string $prefix): string
    {
        if (!str_starts_with($text, $prefix)) {
            return $text;
        }

        return substr($text, strlen($prefix));
    }

    public static function echoAlert(
        string $message,
        string $type = 'danger',
        string $returnRoute = '',
        bool $showReturn = true
    ) {
        if ($showReturn && empty($returnRoute)) {
            $returnRoute = UriCache::getIthUri(-2);
        }

        echo "
        <div class='text-center mt-2'>
            <div class='alert alert-$type'>$message</div>";
        if ($showReturn) {
            echo "<a href='$returnRoute' class='btn btn-primary mb-4'>Volver</a>";
        }
        echo "</div>";
    }
}
