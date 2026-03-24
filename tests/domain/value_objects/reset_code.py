import random
from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.base import NumberField

_FIXED_CODE_DIGITS = 6


@dataclass(slots=True, frozen=True)
class ResetCode(NumberField[int]):
    _min_value: ClassVar[int] = 10 ** (_FIXED_CODE_DIGITS - 1)
    _max_value: ClassVar[int] = 10**_FIXED_CODE_DIGITS - 1

    @classmethod
    def random_value(cls) -> int:
        return random.randint(cls._min_value, cls._max_value)
