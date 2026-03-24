<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\BaseField;

final readonly class Phone extends BaseField
{
    private const int PHONE_LENGTH = 10;
    private const string PHONE_PATTERN = '/^\d{' . self::PHONE_LENGTH . '}$/';

    public function __construct(string $value)
    {
        if (!preg_match(self::PHONE_PATTERN, $value)) {
            throw $this->validationException('must contain exactly ' . self::PHONE_LENGTH . ' digits');
        }

        $this->value = $value;
    }
}
