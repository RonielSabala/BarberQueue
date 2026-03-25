import re
from dataclasses import dataclass, field
from typing import ClassVar

from domain.utils import random_string_len
from domain.value_objects.base.base_field import BaseField


@dataclass(slots=True, frozen=True)
class StringField(BaseField[str]):
    """
    Base for all string value objects.
    """

    _min_len: ClassVar[int | None] = field(default=None, init=False)
    _max_len: ClassVar[int | None] = field(default=None, init=False)
    _allowed_chars: ClassVar[str | None] = field(default=None, init=False)
    _pattern: ClassVar[re.Pattern | None] = field(default=None, init=False)
    _pattern_error_msg: ClassVar[str] = field(
        default="must be in a valid format", init=False
    )

    def __post_init__(self) -> None:
        length = len(self.value)

        if (min_len := self._min_len) is not None and length < min_len:
            raise self._validation_error(f"length must be >= {min_len} (got {length})")

        if (max_len := self._max_len) is not None and length > max_len:
            raise self._validation_error(f"length must be <= {max_len} (got {length})")

        if (pattern := self._pattern) is not None and not pattern.fullmatch(self.value):
            raise self._validation_error(self._pattern_error_msg)

    @classmethod
    def random_value(cls) -> str:
        allowed_chars = cls._allowed_chars
        if allowed_chars is None:
            raise cls._random_value_error("_allowed_chars")

        min_len = cls._min_len
        if min_len is None:
            raise cls._random_value_error("_min_len")

        max_len = cls._max_len
        if max_len is None:
            raise cls._random_value_error("_max_len")

        return random_string_len(allowed_chars, min_len, max_len)
