<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

class PasswordHash extends StringField
{
    public const LENGTH = 255;
    protected const MIN_LEN = self::LENGTH;
    protected const MAX_LEN = self::LENGTH;
}
