from __future__ import annotations

from dataclasses import dataclass, fields

from domain.value_objects.base import BaseField


def _to_camel_case(snake: str) -> str:
    parts = snake.split("_")
    return parts[0] + "".join(part.capitalize() for part in parts[1:])


@dataclass(slots=True, frozen=True)
class BaseRequest:
    """
    Base request DTO.
    """

    @classmethod
    def random(cls):
        kwargs = {}

        for field in fields(cls):
            field_type: BaseField = field.type  # type: ignore
            kwargs[field.name] = field_type.random()

        return cls(**kwargs)

    def to_json(self) -> dict:
        result = {}
        for field in fields(self):
            value = getattr(self, field.name)
            result[_to_camel_case(field.name)] = (
                value.value if hasattr(value, "value") else value
            )

        return result
