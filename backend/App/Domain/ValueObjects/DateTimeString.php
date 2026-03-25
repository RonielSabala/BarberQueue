<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\StringField;

final readonly class DateTimeString extends StringField
{
    private const int FIXED_DATETIME_LENGTH = 19;
    private const string DATETIME_FORMAT = 'Y-m-d H:i:s';

    protected const int MIN_LEN = self::FIXED_DATETIME_LENGTH;
    protected const int MAX_LEN = self::FIXED_DATETIME_LENGTH;
    protected const string PATTERN = '/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/';
    protected const string PATTERN_ERROR_MSG = 'must be a valid datetime in format YYYY-MM-DD HH:MM:SS';

    public function __construct(string $value)
    {
        parent::__construct($value);

        if (!$this->isValidDateTime($value)) {
            throw $this->validationException('must be a valid datetime');
        }
    }

    private function isValidDateTime(string $value): bool
    {
        $dateTime = \DateTimeImmutable::createFromFormat(self::DATETIME_FORMAT, $value);
        if ($dateTime === false) {
            return false;
        }

        return $dateTime->format(self::DATETIME_FORMAT) === $value;
    }
}
