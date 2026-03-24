<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

abstract readonly class NameField extends StringField
{
    private const string NAME_PATTERN = '/^[a-zA-Z_][a-zA-Z0-9_]*(?: [a-zA-Z0-9_]+)*$/';

    public function __construct(string $value)
    {
        parent::__construct($value);

        if (!preg_match(self::NAME_PATTERN, $this->value)) {
            throw $this->validationException(
                'must start with a letter or underscore and contain only letters, numbers, underscores or spaces'
            );
        }
    }
}
