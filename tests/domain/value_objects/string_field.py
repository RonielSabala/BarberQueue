from __future__ import annotations

from dataclasses import dataclass, field
from typing import ClassVar

from domain.value_objects.base import BaseField


@dataclass(slots=True, frozen=True)
class StringField(BaseField[str]):
    """
    Base for all string value objects.

    Subclasses set `_min_len` / `_max_len` as class-level
    field() defaults.
    """

    _min_len: ClassVar[int | None] = field(default=None, init=False)
    _max_len: ClassVar[int | None] = field(default=None, init=False)

    def __post_init__(self) -> None:
        length = len(self.value)

        min_len = self._min_len
        if min_len is not None and length < min_len:
            raise self._validation_error(f"must be at least {min_len} characters")

        max_len = self._max_len
        if max_len is not None and length > max_len:
            raise self._validation_error(f"must be at most {max_len} characters")
