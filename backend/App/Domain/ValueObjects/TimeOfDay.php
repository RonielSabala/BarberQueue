<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

final class TimeOfDay extends BaseField
{
    private const TIME_PATTERN = '/^\d{2}:\d{2}:\d{2}$/';

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

        [$h, $m, $s] = array_map('intval', explode(':', $value));
        return $h >= 0 && $h <= 23
               && $m >= 0 && $m <= 59
               && $s >= 0 && $s <= 59;
    }
}
