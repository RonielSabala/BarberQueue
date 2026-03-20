from __future__ import annotations

import random
from dataclasses import dataclass

from domain.value_objects.number_field import NumberField

_FIXED_DIGITS = 6


@dataclass(slots=True, frozen=True)
class ResetCode(NumberField):
    _min_value: int = 10 ** (_FIXED_DIGITS - 1)
    _max_value: int = 10**_FIXED_DIGITS - 1

    @classmethod
    def random(cls) -> ResetCode:
        code = random.randint(cls._min_value, cls._max_value)
        return cls(code)
