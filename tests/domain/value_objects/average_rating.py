from dataclasses import dataclass

from domain.value_objects.base import DecimalField


@dataclass(slots=True, frozen=True)
class AverageRating(DecimalField):
    _min_value = 1.0
    _max_value = 5.0
