from __future__ import annotations

import string
from dataclasses import dataclass
from typing import ClassVar

from domain.utils import random_string_len
from domain.value_objects.string_field import StringField

_PASSWORD_CHARS = string.ascii_letters + string.digits


@dataclass(slots=True, frozen=True)
class Password(StringField):
    _min_len: ClassVar[int] = 8
    _max_len: ClassVar[int] = 50

    @classmethod
    def random(cls) -> Password:
        password = random_string_len(_PASSWORD_CHARS, cls._min_len, cls._max_len)
        return cls(password)
