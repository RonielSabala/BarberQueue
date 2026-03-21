from __future__ import annotations

import random
import string
from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.string_field import StringField

_FIXED_HASH_LENGTH = 60
_BCRYPT_PREFIX = "$2b$10$"
_BCRYPT_BODY_LEN = _FIXED_HASH_LENGTH - len(_BCRYPT_PREFIX)
_BCRYPT_CHARS = string.ascii_letters + string.digits + "./"


@dataclass(slots=True, frozen=True)
class PasswordHash(StringField):
    _min_len: ClassVar[int] = _FIXED_HASH_LENGTH
    _max_len: ClassVar[int] = _FIXED_HASH_LENGTH

    @classmethod
    def random(cls) -> PasswordHash:
        body = "".join(random.choices(_BCRYPT_CHARS, k=_BCRYPT_BODY_LEN))
        password_hash = f"{_BCRYPT_PREFIX}{body}"
        return cls(password_hash)
