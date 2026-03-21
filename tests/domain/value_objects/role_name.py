from __future__ import annotations

import random
from dataclasses import dataclass

from domain.value_objects.base_field import BaseField

_ROLES = ("client", "barber", "assistant", "admin")


@dataclass(slots=True, frozen=True)
class RoleName(BaseField):
    def __post_init__(self) -> None:
        if self.value not in _ROLES:
            raise self._validation_error(f"must be one of: {', '.join(sorted(_ROLES))}")

    @classmethod
    def random(cls) -> RoleName:
        role = random.choice(_ROLES)
        return cls(role)
