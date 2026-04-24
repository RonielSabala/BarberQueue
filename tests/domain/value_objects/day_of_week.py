from dataclasses import dataclass
from typing import Annotated, ClassVar, Self, TypeAlias

from domain.value_objects.base import IntegerField, ListOf

MIN_DAY_OF_WEEK = 1
MAX_DAY_OF_WEEK = 7


@dataclass(slots=True, frozen=True)
class DayOfWeek(IntegerField):
    _min_value: ClassVar[int] = MIN_DAY_OF_WEEK
    _max_value: ClassVar[int] = MAX_DAY_OF_WEEK

    @classmethod
    def from_list(cls, days: list[int]) -> list[Self]:
        return [cls(day) for day in days]


WorkingDays: TypeAlias = Annotated[
    list[DayOfWeek],
    ListOf(base_type=DayOfWeek, min_items=MIN_DAY_OF_WEEK, max_items=MAX_DAY_OF_WEEK),
]
IntWorkingDays: TypeAlias = Annotated[
    list[int],
    ListOf(base_type=int, min_items=MIN_DAY_OF_WEEK, max_items=MAX_DAY_OF_WEEK),
]
