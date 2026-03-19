<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

abstract class StringField extends BaseField
{
    protected const ?int MIN_LEN = null;
    protected const ?int MAX_LEN = null;

    public function __construct(string $value)
    {
        $this->value = $value;
        $len = mb_strlen($value, 'UTF-8');

        $minLen = static::MIN_LEN;
        if ($minLen !== null && $len < $minLen) {
            $this->throwValidationException("must be at least {$minLen} characters");
        }

        $maxLen = static::MAX_LEN;
        if ($maxLen !== null && $len > $maxLen) {
            $this->throwValidationException("must be at most {$maxLen} characters");
        }
    }
}
