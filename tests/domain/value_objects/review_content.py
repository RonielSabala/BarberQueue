import string
from dataclasses import dataclass
from typing import ClassVar

from domain.utils import random_string_len
from domain.value_objects.base import StringField

_REVIEW_CHARS = string.ascii_letters + string.digits + r"\/|!@#$%&*(){}[]¿?'-=+;,._ "


@dataclass(slots=True, frozen=True)
class ReviewContent(StringField):
    _min_len: ClassVar[int] = 1
    _max_len: ClassVar[int] = 1000

    @classmethod
    def random_value(cls) -> str:
        return random_string_len(_REVIEW_CHARS, cls._min_len, cls._max_len)
