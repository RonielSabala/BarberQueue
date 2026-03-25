<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

abstract readonly class StringField extends BaseField
{
    protected const ?int MIN_LEN = null;
    protected const ?int MAX_LEN = null;
    protected const ?string PATTERN = null;
    protected const string PATTERN_ERROR_MSG = 'must be in a valid format';

    public function __construct(string $value)
    {
        $length = mb_strlen($value, 'UTF-8');

        $minLen = static::MIN_LEN;
        if ($minLen !== null && $length < $minLen) {
            throw $this->validationException("length must be >= {$minLen} (got {$length})");
        }

        $maxLen = static::MAX_LEN;
        if ($maxLen !== null && $length > $maxLen) {
            throw $this->validationException("length must be <= {$maxLen} (got {$length})");
        }

        $pattern = static::PATTERN;
        if ($pattern !== null && !preg_match($pattern, $value)) {
            throw $this->validationException(static::PATTERN_ERROR_MSG);
        }

        $this->value = $value;
    }
}
