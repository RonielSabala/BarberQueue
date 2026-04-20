from __future__ import annotations

import dataclasses
from collections.abc import Iterator
from dataclasses import dataclass
from enum import StrEnum
from typing import Any, get_type_hints

from domain.utils import to_camel_case
from domain.value_objects.base import BaseField
from helpers.unwrap_type import is_annotated, is_union, unwrap_type


def _serialize(value: Any) -> Any:
    if isinstance(value, StrEnum):
        return value.value

    if isinstance(value, BaseDto):
        return value.to_json()

    if isinstance(value, BaseField):
        return value.value

    if isinstance(value, list):
        return [_serialize(item) for item in value]

    return value


@dataclass(slots=True, kw_only=True, frozen=True)
class FieldInfo:
    field_name: str
    field_type: Any
    is_optional: bool


@dataclass(frozen=True)
class BaseDto:
    """
    Base DTO class.
    """

    @classmethod
    def class_fields(cls) -> Iterator[FieldInfo]:
        hints = get_type_hints(cls, include_extras=True)
        for field in dataclasses.fields(cls):
            name = field.name
            hint = hints[name]
            yield FieldInfo(
                field_name=name,
                field_type=hint if is_annotated(hint) else unwrap_type(hint),
                is_optional=is_union(hint),
            )

    def items(self) -> Iterator[tuple[str, Any]]:
        return (
            (name := field.name, getattr(self, name))
            for field in dataclasses.fields(self)
        )

    def to_json(self) -> dict:
        return {to_camel_case(k): _serialize(v) for k, v in self.items()}
