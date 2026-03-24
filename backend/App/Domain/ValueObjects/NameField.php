<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

abstract class NameField extends StringField
{
    public function __construct(string $value)
    {
        parent::__construct($value);

        if (trim($this->value) === '') {
            $this->validationException('cannot be blank');
        }
    }
}
