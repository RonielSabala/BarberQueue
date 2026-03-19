<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Core\HttpStatus;
use App\Exceptions\ValidationException;

class Email extends StringField
{
    protected const MIN_LEN = 5;
    protected const MAX_LEN = 100;

    public function __construct(string $value)
    {
        parent::__construct($value);

        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new ValidationException('Invalid email format', HttpStatus::UnprocessableEntity);
        }
    }
}
