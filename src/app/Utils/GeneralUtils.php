<?php

declare(strict_types=1);

namespace App\Utils;

class GeneralUtils
{
    private const GO_BACK_TEXT = 'Volver';

    public static function removePrefix(string $text, string $prefix): string
    {
        if (!str_starts_with($text, $prefix)) {
            return $text;
        }

        return substr($text, strlen($prefix));
    }

    public static function removeSuffix(string $text, string $suffix): string
    {
        if (!str_ends_with($text, $suffix)) {
            return $text;
        }

        return substr($text, 0, -strlen($suffix));
    }

    public static function consecutiveSlices(string $separator, string $text): array
    {
        $result = [''];
        if ($text === '') {
            return $result;
        }

        $parts = explode($separator, $text);
        $accumulated = '';

        foreach ($parts as $part) {
            $accumulated .= $part . $separator;
            $result[] = $accumulated;
        }

        return $result;
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

        echo "<div class='text-center mt-2'>";
        echo "<div class='alert alert-$type'>$message</div>";
        if ($showReturn) {
            echo "<a href='$returnRoute' class='btn btn-primary mb-4'>" . self::GO_BACK_TEXT . "</a>";
        }

        echo "</div>";
    }
}
