from __future__ import annotations

import random
from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.number_field import NumberField

_FIXED_CODE_DIGITS = 6


@dataclass(slots=True, frozen=True)
class ResetCode(NumberField):
    _min_value: ClassVar[int] = 10 ** (_FIXED_CODE_DIGITS - 1)
    _max_value: ClassVar[int] = 10**_FIXED_CODE_DIGITS - 1

    @classmethod
    def random(cls) -> ResetCode:
        code = random.randint(cls._min_value, cls._max_value)
        return cls(code)
