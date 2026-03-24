<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

final class PhotoUrl extends StringField
{
    protected const int MIN_LEN = 12;

    public function __construct(string $value)
    {
        parent::__construct($value);

        $url = filter_var($this->value, FILTER_VALIDATE_URL);
        if (!$url || !\in_array(parse_url($url, PHP_URL_SCHEME), ['http', 'https'], true)) {
            throw $this->validationException('must be a valid http or https url');
        }
    }
}
