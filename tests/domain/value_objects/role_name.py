from dataclasses import dataclass
from enum import StrEnum

from domain.value_objects.base import EnumField


class Role(StrEnum):
    CLIENT = "client"
    BARBER = "barber"
    ASSISTANT = "assistant"
    ADMIN = "admin"


@dataclass(slots=True, frozen=True)
class RoleName(EnumField):
    _enum_values = tuple(Role)
