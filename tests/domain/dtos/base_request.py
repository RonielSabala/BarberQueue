import random
from dataclasses import dataclass

from domain.dtos import BaseDto
from domain.value_objects.base import BaseField


@dataclass(frozen=True)
class BaseRequest(BaseDto):
    """
    Base request DTO.
    """

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

        kwargs = {
            field_name: (
                field_type.random()
                if issubclass(field_type, BaseField)
                and (not is_optional or random.random() < optional_chance)
                else None
            )
            for field_name, field_type, is_optional in cls.iter_field_types()
        }

        return cls(**kwargs)
