<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\BaseField;

enum Role: string
{
    case Client = 'client';
    case Barber = 'barber';
    case Assistant = 'assistant';
    case Admin = 'admin';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

final readonly class RoleName extends BaseField
{
    public function __construct(string $value)
    {
        if (Role::tryFrom($value) === null) {
            $allowed = implode(', ', Role::values());
            throw $this->validationException("must be one of: {$allowed}");
        }

        $this->value = $value;
    }
}
