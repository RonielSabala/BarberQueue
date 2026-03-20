from __future__ import annotations

import random
import re
import string
from dataclasses import dataclass

from domain.value_objects.string_field import StringField

_PATTERN = re.compile(r"^[^@]+@[^@]+\.[^@]+$")
_DOMAINS = ("gmail.com", "yahoo.com", "outlook.com", "hotmail.com")


@dataclass(slots=True, frozen=True)
class Email(StringField):
    _min_len: int = 5
    _max_len: int = 100

    def __post_init__(self) -> None:
        super().__post_init__()

        if not _PATTERN.match(self.value):
            raise self._validation_error("Invalid email format")

    @classmethod
    def random(cls) -> Email:
        user_len = random.randint(cls._min_len, cls._max_len)
        user = "".join(random.choices(string.ascii_lowercase, k=user_len))
        domain = random.choice(_DOMAINS)
        email = f"{user}@{domain}"
        return cls(email)
