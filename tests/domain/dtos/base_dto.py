from __future__ import annotations

from dataclasses import dataclass, fields

from domain.utils import to_camel_case
from domain.value_objects.base import BaseField


@dataclass(slots=True, kw_only=True, frozen=True)
class BaseDto:
    """
    Base DTO class.
    """

    def to_json(self) -> dict:
        json = {}
        for field in fields(self):
            key = to_camel_case(field.name)
            value = getattr(self, field.name)

            if isinstance(value, BaseDto):
                value = value.to_json()
            elif isinstance(value, BaseField):
                value = value.value

            json[key] = value

        return json
