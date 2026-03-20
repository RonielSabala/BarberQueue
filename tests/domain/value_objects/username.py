from __future__ import annotations

import random
import string
from dataclasses import dataclass

from domain.value_objects.string_field import StringField

_CHARS = string.ascii_letters + string.digits + " "


@dataclass(slots=True, frozen=True)
class Username(StringField):
    _min_len: int = 5
    _max_len: int = 30

    def __post_init__(self) -> None:
        if not self.value.strip():
            raise self._validation_error("cannot be blank")

    @classmethod
    def random(cls) -> Username:
        user_len = random.randint(cls._min_len, cls._max_len)
        username = "".join(random.choices(_CHARS, k=user_len))
        return cls(username)
