from dataclasses import dataclass

from domain.value_objects.base import NameField


@dataclass(slots=True, frozen=True)
class BarbershopName(NameField):
    _min_len = 5
    _max_len = 100
