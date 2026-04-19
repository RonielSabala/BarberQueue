import random
from dataclasses import dataclass
from typing import Any, Self

from domain.dtos import BaseDto
from domain.utils import DEFAULT_OPTIONAL_CHANCE, random_bool
from domain.value_objects.base import BaseField
from helpers.unwrap_type import unwrap_list_of


def _get_random_value_by_type(value_type: Any, optional_chance: float) -> Any:
    # Handle Annotated
    list_metadata = unwrap_list_of(value_type)
    if list_metadata:
        min_items = list_metadata.min_items
        max_items = list_metadata.max_items
        if min_items is None:
            raise ValueError(
                f"FieldOf.min_items is required in order to randomize <{value_type}>"
            )

        list_length = random.randint(
            min_items, min_items + 1 if max_items is None else max_items
        )
        return [
            _get_random_value_by_type(list_metadata.base_type, optional_chance)
            for _ in range(list_length)
        ]

    is_type = isinstance(value_type, type)

    # Handle BaseRequests
    if is_type and issubclass(value_type, BaseRequest):
        return value_type.random(optional_chance=optional_chance)

    # Handle Value Objects
    if is_type and issubclass(value_type, BaseField):
        return value_type.random()

    if is_type and value_type is bool:
        return random_bool()

    raise ValueError(f"Type '{value_type}' cannot be randomized")


@dataclass(frozen=True)
class BaseRequest(BaseDto):
    """
    Base request DTO.
    """

    @classmethod
    def random(
        cls, optional_chance: float = DEFAULT_OPTIONAL_CHANCE, **fields: Any | tuple
    ) -> Self:
        """
        Generates a random request.

        Args:
            - `optional_chance`: Probability (0.0 to 1.0) that an Optional
            field is populated.

            - `fields`: Field overrides.

        Raises:
            **ValueError**: If `optional_chance` is not between 0 and 1.
        """

        if not (0 <= optional_chance <= 1):
            raise ValueError(
                f"optional_chance ({optional_chance}) must be between 0 and 1."
            )

        class_fields = tuple(cls.class_fields())
        valid_names = {field_info.field_name for field_info in class_fields}

        for field_name in fields:
            if field_name not in valid_names:
                raise ValueError(
                    f"Field '{field_name}' does not exist in {cls.__name__}"
                )

        kwargs = {}
        for field_info in class_fields:
            field_name = field_info.field_name
            field_value = None

            # Override field value
            if field_name in fields:
                value = fields[field_name]
                field_value = (
                    random.choice(value) if isinstance(value, tuple) else value
                )
            # Populate field
            elif not field_info.is_optional or random.random() < optional_chance:
                field_value = _get_random_value_by_type(
                    field_info.field_type, optional_chance
                )

            kwargs[field_name] = field_value

        return cls(**kwargs)
