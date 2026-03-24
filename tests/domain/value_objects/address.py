import string
from dataclasses import dataclass
from typing import ClassVar

from domain.utils import random_string_len
from domain.value_objects.base import StringField

_ADDRESS_CHARS = string.ascii_letters + string.digits + " ./"


@dataclass(slots=True, frozen=True)
class Address(StringField):
    _min_len: ClassVar[int] = 12
    _max_len: ClassVar[int] = 255

    @classmethod
    def random_value(cls) -> str:
        return random_string_len(_ADDRESS_CHARS, cls._min_len, cls._max_len)
