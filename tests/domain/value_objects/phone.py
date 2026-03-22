from __future__ import annotations

import random
import re
import string
from dataclasses import dataclass
from typing import ClassVar

from domain.utils import random_string
from domain.value_objects.string_field import StringField

_SUFFIX_PHONE_LEN = 7
_FIXED_PHONE_LENGTH = 10
_PHONE_PREFIXES = ("809", "829", "849")
_PHONE_PATTERN = re.compile(rf"^({'|'.join(_PHONE_PREFIXES)})\d{{7}}$")


@dataclass(slots=True, frozen=True)
class Phone(StringField):
    _min_len: ClassVar[int] = _FIXED_PHONE_LENGTH
    _max_len: ClassVar[int] = _FIXED_PHONE_LENGTH

    def __post_init__(self) -> None:
        StringField.__post_init__(self)

        if not _PHONE_PATTERN.match(self.value):
            raise self._validation_error("must be a valid phone number")

    @classmethod
    def random(cls) -> Phone:
        prefix = random.choice(_PHONE_PREFIXES)
        suffix = random_string(string.digits, _SUFFIX_PHONE_LEN)
        phone = f"{prefix}{suffix}"
        return cls(phone)
