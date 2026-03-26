import random
from dataclasses import dataclass
from enum import StrEnum

from domain.value_objects.base import BaseField


class Role(StrEnum):
    CLIENT = "client"
    BARBER = "barber"
    ASSISTANT = "assistant"
    ADMIN = "admin"


_ROLE_NAMES = tuple(Role)


@dataclass(slots=True, frozen=True)
class RoleName(BaseField[str]):
    def __post_init__(self) -> None:
        if self.value not in _ROLE_NAMES:
            allowed = ", ".join(sorted(_ROLE_NAMES))
            raise self._validation_error(f"must be one of: {allowed}")

    @classmethod
    def random_value(cls) -> str:
        return random.choice(_ROLE_NAMES)
