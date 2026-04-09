<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

abstract readonly class EnumField extends BaseField
{
    /** @var class-string<\BackedEnum> ENUM_CLASS */
    protected const string ENUM_CLASS = '';

    public function __construct(string $value)
    {
        $enumClass = static::ENUM_CLASS;
        if ($enumClass === '') {
            throw new \LogicException(static::class . ' must define ENUM_CLASS');
        }

        if ($enumClass::tryFrom($value) !== null) {
            $this->value = $value;
            return;
        }

        $allowedValues = array_map(
            static fn (\BackedEnum $case) => "'{$case->value}'",
            $enumClass::cases()
        );

        $allowed = implode(', ', $allowedValues);
        throw $this->validationException("must be one of: {$allowed}");
    }
}
