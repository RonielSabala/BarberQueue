<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

use App\Exceptions\Base\ValueObjectException;

abstract readonly class StringField extends BaseField
{
    protected const ?int MIN_LEN = null;
    protected const ?int MAX_LEN = null;
    protected const ?string PATTERN = null;
    protected const ?string PATTERN_ERROR_MSG = null;

    public function __construct(string $value)
    {
        $minLen = static::MIN_LEN;
        $maxLen = static::MAX_LEN;
        $pattern = static::PATTERN;
        $length = mb_strlen($value, 'UTF-8');

        if ($pattern !== null && !preg_match($pattern, $value)) {
            $patternErrorMsg = static::PATTERN_ERROR_MSG;
            if ($patternErrorMsg === null) {
                throw $this->undefinedFieldException('PATTERN_ERROR_MSG');
            }

            throw new ValueObjectException($patternErrorMsg);
        }

        if ($minLen !== null && $length < $minLen) {
            throw new ValueObjectException("length must be >= {$minLen} (got {$length})");
        }

        if ($maxLen !== null && $length > $maxLen) {
            throw new ValueObjectException("length must be <= {$maxLen} (got {$length})");
        }

        $this->value = $value;
    }
}
