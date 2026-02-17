<?php

declare(strict_types=1);

namespace App\Utils;

class ArrayUtils
{
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
}
