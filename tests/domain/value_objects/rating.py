import random
from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.base import NumberField


@dataclass(slots=True, frozen=True)
class Rating(NumberField[int]):
    _min_value: ClassVar[int] = 1
    _max_value: ClassVar[int] = 5

    @classmethod
    def random_value(cls) -> int:
        return random.randint(cls._min_value, cls._max_value)
