<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\StringField;

final class PasswordHash extends StringField
{
    private const int FIXED_HASH_LENGTH = 60;
    protected const int MIN_LEN = self::FIXED_HASH_LENGTH;
    protected const int MAX_LEN = self::FIXED_HASH_LENGTH;
}
