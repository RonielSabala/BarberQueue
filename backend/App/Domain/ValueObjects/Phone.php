<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\BaseField;

final class Phone extends BaseField
{
    private const string PHONE_PATTERN = '/^\d{10}$/';

    public function __construct(string $value)
    {
        if (!preg_match(self::PHONE_PATTERN, $value)) {
            throw $this->validationException('must contain exactly 10 digits');
        }

        $this->value = $value;
    }
}
