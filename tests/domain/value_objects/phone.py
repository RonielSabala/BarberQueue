import random
import re
import string
from dataclasses import dataclass

from domain.utils import random_string
from domain.value_objects.base import BaseField

_PHONE_LENGTH = 10
_PHONE_PREFIXES = ("809", "829", "849")

_PREFIX_PHONE_LEN = max(map(len, _PHONE_PREFIXES))
_SUFFIX_PHONE_LEN = _PHONE_LENGTH - _PREFIX_PHONE_LEN

_PHONE_PATTERN = re.compile(
    rf"^({'|'.join(_PHONE_PREFIXES)})\d{{{_SUFFIX_PHONE_LEN}}}$"
)


@dataclass(slots=True, frozen=True)
class Phone(BaseField[str]):
    def __post_init__(self) -> None:
        if not _PHONE_PATTERN.fullmatch(self.value):
            raise self._validation_error(f"must contain exactly {_PHONE_LENGTH} digits")

    @classmethod
    def random_value(cls) -> str:
        prefix = random.choice(_PHONE_PREFIXES)
        suffix = random_string(string.digits, _SUFFIX_PHONE_LEN)
        return f"{prefix}{suffix}"
