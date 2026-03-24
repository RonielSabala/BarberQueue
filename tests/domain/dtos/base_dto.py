from __future__ import annotations

import dataclasses
from collections.abc import Iterator
from dataclasses import dataclass
from typing import Any, get_type_hints

from domain.utils import to_camel_case
from domain.value_objects.base_field import BaseField
from helpers.unwrap_type import is_union, unwrap_type


def _serialize(value: Any) -> Any:
    if isinstance(value, BaseDto):
        return value.to_json()

    if isinstance(value, BaseField):
        return value.value

    return value


@dataclass(frozen=True)
class BaseDto:
    """
    Base DTO class.
    """

    @classmethod
    def iter_field_types(cls) -> Iterator[tuple[str, type, bool]]:
        hints = get_type_hints(cls)
        return (
            (name := field.name, unwrap_type(hint := hints[name]), is_union(hint))
            for field in dataclasses.fields(cls)
        )

    def items(self) -> Iterator[tuple[str, Any]]:
        return (
            (name := field.name, getattr(self, name))
            for field in dataclasses.fields(self)
        )

    @property
    def all_none(self) -> bool:
        return all(value is None for _, value in self.items())

    def to_json(self) -> dict:
        return {to_camel_case(k): _serialize(v) for k, v in self.items()}
