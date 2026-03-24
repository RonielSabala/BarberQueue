<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

final class ResetCode extends NumberField
{
    private const int FIXED_CODE_DIGITS = 6;
    protected const int MIN = 10 ** (self::FIXED_CODE_DIGITS - 1);
    protected const int MAX = 10 ** self::FIXED_CODE_DIGITS - 1;

    public static function getNewCode(): int
    {
        return mt_rand(self::MIN, self::MAX);
    }
}
