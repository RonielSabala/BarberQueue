from dataclasses import dataclass

from domain.value_objects.base import IntegerField


@dataclass(slots=True, frozen=True)
class PositiveInteger(IntegerField):
    _min_value = 1
