<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Core\HttpStatus;

abstract class BaseException extends \Exception
{
    public function __construct(
        string $message,
        private readonly HttpStatus $status
    ) {
        parent::__construct($message, $status->value);
    }

    public function getStatus(): HttpStatus
    {
        return $this->status;
    }
}
