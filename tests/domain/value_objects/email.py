import random
import re
import string
from dataclasses import dataclass
from typing import ClassVar

from domain.utils import random_string_len
from domain.value_objects.base import StringField

_EMAIL_CHARS = string.ascii_letters + string.digits + "_%+-"
_EMAIL_DOMAINS = ("gmail.com", "yahoo.com", "outlook.com", "hotmail.com")

_MIN_EMAIL_LENGTH = 5
_MAX_EMAIL_LENGTH = 254
_MIN_EMAIL_LOCAL_LENGTH = 1
_MAX_EMAIL_LOCAL_LENGTH = 64
_MIN_TLD_LENGTH = 2
_MAX_TLD_LENGTH = 63

_EMAIL_PATTERN = re.compile(
    rf"(?=.{{1,{_MAX_EMAIL_LENGTH}}}$)"
    rf"(?=.{{{_MIN_EMAIL_LOCAL_LENGTH},{_MAX_EMAIL_LOCAL_LENGTH}}}@)"
    rf"[{re.escape(_EMAIL_CHARS)}]+"
    rf"@"
    rf"(?:[A-Za-z0-9-]+\.)+"
    rf"[A-Za-z]{{{_MIN_TLD_LENGTH},{_MAX_TLD_LENGTH}}}$"
)


@dataclass(slots=True, frozen=True)
class Email(StringField):
    _min_len = _MIN_EMAIL_LENGTH
    _max_len = _MAX_EMAIL_LENGTH
    _min_local_len: ClassVar[int] = _MIN_EMAIL_LOCAL_LENGTH
    _max_local_len: ClassVar[int] = _MAX_EMAIL_LOCAL_LENGTH
    _pattern = _EMAIL_PATTERN
    _pattern_error_msg = "must be a valid email in format user@domain"

    @classmethod
    def random_value(cls) -> str:
        user = random_string_len(_EMAIL_CHARS, cls._min_local_len, cls._max_local_len)
        domain = random.choice(_EMAIL_DOMAINS)
        return f"{user}@{domain}"
