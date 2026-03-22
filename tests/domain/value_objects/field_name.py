from __future__ import annotations

import random
import re
import string
from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.string_field import StringField

_CHARS = string.ascii_letters + "_"
_PATTERN = re.compile(r"^[a-zA-Z_][a-zA-Z0-9_]*$")


@dataclass(frozen=True)
class FieldName(StringField):
    _min_len: ClassVar[int] = 1
    _max_len: ClassVar[int] = 25

    def __post_init__(self) -> None:
        super().__post_init__()

        if not _PATTERN.match(self.value):
            raise self._validation_error("must be a valid field name")

    @classmethod
    def random(cls) -> FieldName:
        length = random.randint(cls._min_len, cls._max_len)
        field_name = "".join(random.choices(_CHARS, k=length))
        return cls(field_name)
