from __future__ import annotations

import random
from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.base import NumberField

_RANDOM_MAX = 10_000


@dataclass(slots=True, frozen=True)
class Id(NumberField):
    _min_value: ClassVar[int] = 0

    @classmethod
    def random(cls) -> Id:
        id_number = random.randint(cls._min_value, _RANDOM_MAX)
        return cls(id_number)
