import dataclasses
import random
from dataclasses import dataclass
from typing import get_type_hints

from domain.dtos import BaseDto
from helpers.unwrap_type import is_optional


@dataclass(frozen=True)
class BaseRequest(BaseDto):
    """Base request DTO."""

    @classmethod
    def random(cls, optional_chance: float = 0.5):
        """
        Generates a random request.

        Args:
            `optional_chance`: Probability (0.0 to 1.0) that an Optional
            field is populated. By default it's set to 0.5.

        Raises:
            **ValueError**: If `optional_chance` is not between 0 and 1.
        """

        if not (0 <= optional_chance <= 1):
            raise ValueError(
                f"optional_chance ({optional_chance}) must be between 0 and 1."
            )

        hints = get_type_hints(cls)
        kwargs = {}

        for field in dataclasses.fields(cls):
            field_name = field.name
            optional, field_type = is_optional(hints[field_name])

            field_value = None
            if field_type is not None and (
                not optional or random.random() < optional_chance
            ):
                field_value = field_type.random()

            kwargs[field_name] = field_value

        return cls(**kwargs)
