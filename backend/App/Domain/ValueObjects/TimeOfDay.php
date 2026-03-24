<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\BaseField;

final class TimeOfDay extends BaseField
{
    private const int MIN_HOUR = 0;
    private const int MAX_HOUR = 23;
    private const int MIN_MINUTE = 0;
    private const int MAX_MINUTE = 59;
    private const int MIN_SECOND = 0;
    private const int MAX_SECOND = 59;
    private const string TIME_PATTERN = '/^\d{2}:\d{2}:\d{2}$/';

    public function __construct(string $value)
    {
        if (!$this->isValidTime($value)) {
            throw $this->validationException('must be a valid time in format HH:MM:SS');
        }

        $this->value = $value;
    }

    private function isValidTime(string $value): bool
    {
        if (!preg_match(self::TIME_PATTERN, $value)) {
            return false;
        }

        [$hour, $minute, $second] = array_map('intval', explode(':', $value));
        return $hour >= self::MIN_HOUR && $hour <= self::MAX_HOUR
               && $minute >= self::MIN_MINUTE && $minute <= self::MAX_MINUTE
               && $second >= self::MIN_SECOND && $second <= self::MAX_SECOND;
    }
}
