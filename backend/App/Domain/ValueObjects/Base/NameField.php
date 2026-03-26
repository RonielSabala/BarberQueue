<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

abstract readonly class NameField extends StringField
{
    protected const string PATTERN = '/^[a-zA-Z_][a-zA-Z0-9_]*(?: [a-zA-Z0-9_]+)*$/';
    protected const string PATTERN_ERROR_MSG = 'must start with a letter or underscore and contain only letters, numbers, underscores or spaces';
}
