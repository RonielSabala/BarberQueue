from __future__ import annotations

import random
import re
import string
from dataclasses import dataclass
from typing import ClassVar

from domain.exceptions import ValidationError
from domain.value_objects.string_field import StringField

_EMAIL_CHARS = string.ascii_letters + string.digits + "_%+-"
_EMAIL_DOMAINS = ("gmail.com", "yahoo.com", "outlook.com", "hotmail.com")
_EMAIL_PATTERN = re.compile(
    r"^(?=.{1,254}$)"
    r"(?=.{1,64}@)"
    r"[A-Za-z0-9._%+-]+"
    r"@"
    r"(?:[A-Za-z0-9-]+\.)+"
    r"[A-Za-z]{2,63}$"
)


@dataclass(slots=True, frozen=True)
class Email(StringField):
    _min_len: ClassVar[int] = 5
    _max_len: ClassVar[int] = 254
    _min_local_len: ClassVar[int] = 1
    _max_local_len: ClassVar[int] = 64

    def __post_init__(self) -> None:
        StringField.__post_init__(self)

        value = self.value.strip()
        if value != self.value or not _EMAIL_PATTERN.fullmatch(value):
            raise ValidationError("Invalid email format")

    @classmethod
    def random(cls) -> Email:
        user_len = random.randint(cls._min_local_len, cls._max_local_len)
        user = "".join(random.choices(_EMAIL_CHARS, k=user_len))
        domain = random.choice(_EMAIL_DOMAINS)
        return cls(f"{user}@{domain}")
