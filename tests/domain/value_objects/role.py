from dataclasses import dataclass

from domain.enums import RoleEnum
from domain.value_objects.base import EnumField


@dataclass(slots=True, frozen=True)
class Role(EnumField):
    _enum_values = tuple(RoleEnum)
