from __future__ import annotations

from dataclasses import dataclass, field
from typing import ClassVar

from domain.value_objects.base import BaseField


@dataclass(slots=True, frozen=True)
class NumberField(BaseField[int]):
    """
    Base for all integer value objects.

    Subclasses set `_min_value` and `_max_value` as class-level
    field() defaults.
    """

    _min_value: ClassVar[int | None] = field(default=None, init=False)
    _max_value: ClassVar[int | None] = field(default=None, init=False)

    def __post_init__(self) -> None:
        min_value = self._min_value
        if min_value is not None and self.value < min_value:
            raise self._validation_error(f"must be greater or equal than {min_value}")

        max_value = self._max_value
        if max_value is not None and self.value > max_value:
            raise self._validation_error(f"must be less or equal than {max_value}")
