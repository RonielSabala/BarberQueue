from dataclasses import dataclass

from domain.enums import EmployeeRoleEnum
from domain.value_objects.base import EnumField


@dataclass(slots=True, frozen=True)
class EmployeeRole(EnumField):
    _enum_values = tuple(EmployeeRoleEnum)
