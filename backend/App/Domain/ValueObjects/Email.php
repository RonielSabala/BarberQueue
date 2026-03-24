<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\StringField;

final readonly class Email extends StringField
{
    protected const int MIN_LEN = 5;
    protected const int MAX_LEN = 254;

    public function __construct(string $value)
    {
        parent::__construct($value);

        if (!filter_var($this->value, FILTER_VALIDATE_EMAIL)) {
            throw $this->validationException('must be a valid email in format user@domain');
        }
    }
}
