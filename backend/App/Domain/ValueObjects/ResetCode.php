<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\IntegerField;

final readonly class ResetCode extends IntegerField
{
    private const int FIXED_CODE_DIGITS = 6;
    protected const int MIN_VALUE = 10 ** (self::FIXED_CODE_DIGITS - 1);
    protected const int MAX_VALUE = 10 ** self::FIXED_CODE_DIGITS - 1;

    public static function getNewCode(): int
    {
        return mt_rand(self::MIN_VALUE, self::MAX_VALUE);
    }
}
