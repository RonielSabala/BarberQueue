import random
from dataclasses import dataclass
from typing import Any

from domain.dtos import BaseDto
from domain.value_objects.base import BaseField
from helpers.unwrap_type import unwrap_list_of


def _get_random_value_by_type(value_type: Any) -> Any:
    # Handle Annotated
    list_metadata = unwrap_list_of(value_type)
    if list_metadata:
        min_items = list_metadata.min_items
        max_items = list_metadata.max_items
        if min_items is None or max_items is None:
            raise ValueError("Both min_items and min_items are required")

        count = random.randint(min_items, max_items)
        return [
            _get_random_value_by_type(list_metadata.base_type) for _ in range(count)
        ]

    if not isinstance(value_type, type):
        raise ValueError(f"Type '{value_type}' cannot be randomized")

    # Handle Value Objects
    if isinstance(value_type, type) and issubclass(value_type, BaseField):
        return value_type.random()

    if isinstance(value_type, bool):
        return random.random() > 0.5


@dataclass(frozen=True)
class BaseRequest(BaseDto):
    """
    Base request DTO.
    """

    @classmethod
    def random(cls, optional_chance: float = 0.5, **fields: Any | tuple):
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

        field_info = list(cls.iter_field_types())
        valid_names = {name for name, _, _ in field_info}

        for field_name in fields:
            if field_name not in valid_names:
                raise ValueError(
                    f"Field '{field_name}' does not exist in {cls.__name__}"
                )

        kwargs = {}
        for field_name, field_type, is_optional in field_info:
            if field_name in fields:
                value = fields[field_name]
                kwargs[field_name] = (
                    random.choice(value) if isinstance(value, tuple) else value
                )
                continue

            populate = not is_optional or random.random() < optional_chance
            kwargs[field_name] = (
                _get_random_value_by_type(field_type) if populate else None
            )

        return cls(**kwargs)
