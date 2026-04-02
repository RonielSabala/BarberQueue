from dataclasses import dataclass

from domain.value_objects.base import IntegerField


@dataclass(slots=True, frozen=True)
class NonNegativeInteger(IntegerField):
    _min_value = 0
