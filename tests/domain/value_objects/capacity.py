from dataclasses import dataclass

from domain.value_objects.base import IntegerField


@dataclass(slots=True, frozen=True)
class Capacity(IntegerField):
    _min_value = 1
    _max_value = 50
