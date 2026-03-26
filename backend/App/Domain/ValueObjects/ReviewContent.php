<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\StringField;

final readonly class ReviewContent extends StringField
{
    protected const int MIN_LEN = 1;
    protected const int MAX_LEN = 1000;

    public function __construct(string $value)
    {
        $value = trim($value);
        if ($value === '') {
            throw $this->validationException('must not be empty');
        }

        parent::__construct($value);
    }
}
