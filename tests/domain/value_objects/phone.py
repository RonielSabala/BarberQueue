from __future__ import annotations

import random
import re
import string
from dataclasses import dataclass

from domain.value_objects.string_field import StringField

_SUFFIX_LEN = 7
_FIXED_LENGTH = 10
_PREFIXES = ("809", "829", "849")
_PATTERN = re.compile(rf"^({'|'.join(_PREFIXES)})\d{{7}}$")


@dataclass(slots=True, frozen=True)
class Phone(StringField):
    _min_len: int = _FIXED_LENGTH
    _max_len: int = _FIXED_LENGTH

    def __post_init__(self) -> None:
        super().__post_init__()

        if not _PATTERN.match(self.value):
            raise self._validation_error("must be a valid phone number")

    @classmethod
    def random(cls) -> Phone:
        prefix = random.choice(_PREFIXES)
        suffix = "".join(random.choices(string.digits, k=_SUFFIX_LEN))
        phone = f"{prefix}{suffix}"
        return cls(phone)
