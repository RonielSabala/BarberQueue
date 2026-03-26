from dataclasses import dataclass
from typing import Annotated, TypeAlias

from domain.value_objects.base import IntegerField, ListOf


@dataclass(slots=True, frozen=True)
class DayOfWeek(IntegerField):
    _min_value = 1
    _max_value = 7


WorkingDays: TypeAlias = Annotated[
    list[DayOfWeek], ListOf(base_type=DayOfWeek, min_items=1, max_items=7)
]
