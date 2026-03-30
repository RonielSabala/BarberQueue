import random
from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.base.base_field import BaseField


@dataclass(slots=True, frozen=True)
class EnumField(BaseField[str]):
    """
    Base for all value objects that are enums.
    """

    _enum_values: ClassVar[tuple[str, ...]]

    def __post_init__(self) -> None:
        enum_values = type(self)._enum_values
        if self.value in enum_values:
            return

        allowed = ", ".join(enum_values)
        raise self._validation_error(f"must be one of: {allowed}")

    @classmethod
    def random_value(cls) -> str:
        return random.choice(cls._enum_values)
