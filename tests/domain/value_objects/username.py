from __future__ import annotations

import string
from dataclasses import dataclass
from typing import ClassVar

from domain.utils import random_string_len
from domain.value_objects.string_field import StringField

_USERNAME_CHARS = string.ascii_letters + string.digits + " "


@dataclass(slots=True, frozen=True)
class Username(StringField):
    _min_len: ClassVar[int] = 5
    _max_len: ClassVar[int] = 30

    def __post_init__(self) -> None:
        StringField.__post_init__(self)

        if not self.value.strip():
            raise self._validation_error("cannot be blank")

    @classmethod
    def random(cls) -> Username:
        username = random_string_len(_USERNAME_CHARS, cls._min_len, cls._max_len)
        return cls(username)
