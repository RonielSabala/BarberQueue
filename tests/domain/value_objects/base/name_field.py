import random
import re
import string
from dataclasses import dataclass
from typing import ClassVar

from domain.utils import random_string_len
from domain.value_objects.base.string_field import StringField

_FIRST_CHARS = string.ascii_letters + "_"
_NAME_CHARS = _FIRST_CHARS + string.digits + " "


@dataclass(slots=True, frozen=True)
class NameField(StringField):
    """
    Base for all value objects that are usernames/nicknames.
    """

    _min_len: ClassVar[int]
    _max_len: ClassVar[int]
    _pattern = re.compile(r"^[a-zA-Z_][a-zA-Z0-9_]*(?: [a-zA-Z0-9_]+)*$")
    _pattern_error_msg = "must start with a letter or underscore and contain only letters, numbers, underscores or spaces"

    @classmethod
    def random_value(cls) -> str:
        first_char = random.choice(_FIRST_CHARS)
        rest = random_string_len(_NAME_CHARS, cls._min_len - 1, cls._max_len - 1)
        return first_char + rest
