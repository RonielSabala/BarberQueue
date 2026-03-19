<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

class ResetCode extends NumberField
{
    private const DIGITS = 6;
    protected const MIN = 10 ** (self::DIGITS - 1);
    protected const MAX = 10 ** self::DIGITS - 1;

    public static function getNewCode(): int
    {
        return mt_rand(self::MIN, self::MAX);
    }
}
