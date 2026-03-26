<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

class Phone extends StringField
{
    private const int FIXED_PHONE_LENGTH = 10;
    protected const int MIN_LEN = self::FIXED_PHONE_LENGTH;
    protected const int MAX_LEN = self::FIXED_PHONE_LENGTH;
}
