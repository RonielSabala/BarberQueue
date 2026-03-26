<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\StringField;

final readonly class TimeOfDay extends StringField
{
    private const int FIXED_TIME_LENGTH = 8;
    protected const int MIN_LEN = self::FIXED_TIME_LENGTH;
    protected const int MAX_LEN = self::FIXED_TIME_LENGTH;
    protected const string PATTERN = '/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/';
    protected const string PATTERN_ERROR_MSG = 'must be a valid time in format HH:MM:SS';
}
