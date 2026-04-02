from dataclasses import dataclass

from domain.enums import BarberStatusEnum
from domain.value_objects.base import EnumField


@dataclass(slots=True, frozen=True)
class BarberStatus(EnumField):
    _enum_values = tuple(BarberStatusEnum)
