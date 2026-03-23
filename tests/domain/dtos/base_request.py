import random
from dataclasses import dataclass, fields
from typing import get_type_hints

from domain.dtos import BaseDto
from helpers.unwrap_type import is_optional


@dataclass(frozen=True)
class BaseRequest(BaseDto):
    """Base request DTO."""

    @classmethod
    def random(cls):
        hints = get_type_hints(cls)
        kwargs = {}

        for field in fields(cls):
            field_name = field.name
            optional, field_type = is_optional(hints[field_name])

            field_value = None
            if field_type is not None and (not optional or random.random() > 0.5):
                field_value = field_type.random()

            kwargs[field_name] = field_value

        return cls(**kwargs)
