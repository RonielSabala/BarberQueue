from dataclasses import dataclass
from enum import StrEnum

from domain.value_objects.base import EnumField


class BarberStatus(StrEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    RESTING = "resting"


@dataclass(slots=True, frozen=True)
class BarberCurrentStatus(EnumField):
    _enum_values = tuple(BarberStatus)
