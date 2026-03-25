<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\StringField;

final readonly class Phone extends StringField
{
    private const int FIXED_PHONE_LENGTH = 10;

    protected const int MIN_LEN = self::FIXED_PHONE_LENGTH;
    protected const int MAX_LEN = self::FIXED_PHONE_LENGTH;
    protected const string PATTERN = '/^\d{' . self::FIXED_PHONE_LENGTH . '}$/';
    protected const string PATTER_ERROR_MSG = 'must contain exactly ' . self::FIXED_PHONE_LENGTH . ' digits';
}
