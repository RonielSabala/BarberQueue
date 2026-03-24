import random
from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.base import NumberField

_RANDOM_MAX = 10_000


@dataclass(slots=True, frozen=True)
class Id(NumberField[int]):
    _min_value: ClassVar[int] = 1

    @classmethod
    def random_value(cls) -> int:
        return random.randint(cls._min_value, _RANDOM_MAX)
