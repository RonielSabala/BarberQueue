import random
from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.base import NumberField


@dataclass(slots=True, frozen=True)
class AverageRating(NumberField[float]):
    _min_value: ClassVar[float] = 1.0
    _max_value: ClassVar[float] = 5.0

    @classmethod
    def random_value(cls) -> float:
        return random.uniform(cls._min_value, cls._max_value)
