<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\BaseField;

final readonly class DateTimeString extends BaseField
{
    private const string DATETIME_FORMAT = 'Y-m-d H:i:s';
    private const string DATETIME_PATTERN = '/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/';

    public function __construct(string $value)
    {
        if (!$this->isValidDateTime($value)) {
            throw $this->validationException('must be a valid datetime in format YYYY-MM-DD HH:MM:SS');
        }

        $this->value = $value;
    }

    private function isValidDateTime(string $value): bool
    {
        if (!preg_match(self::DATETIME_PATTERN, $value)) {
            return false;
        }

        $dateTime = \DateTimeImmutable::createFromFormat(self::DATETIME_FORMAT, $value);
        if ($dateTime === false) {
            return false;
        }

        $errors = \DateTimeImmutable::getLastErrors();
        return $errors['warning_count'] === 0
            && $errors['error_count'] === 0
            && $dateTime->format(self::DATETIME_FORMAT) === $value;
    }
}
