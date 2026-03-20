<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Core\HttpStatus;
use App\Exceptions\ValidationException;

class Username extends StringField
{
    protected const int MIN_LEN = 5;
    protected const int MAX_LEN = 30;

    public function __construct(string $value)
    {
        parent::__construct($value);

        if (trim($value) === '') {
            throw new ValidationException('cannot be blank', HttpStatus::UnprocessableEntity);
        }
    }
}
