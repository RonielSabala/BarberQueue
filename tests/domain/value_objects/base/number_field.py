import random
from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.base.base_field import BaseField


@dataclass(slots=True, frozen=True)
class NumberField[T: int | float](BaseField[T]):
    """
    Base for all number value objects.
    """

    _min_value: T
    _max_value: T

    def __post_init__(self) -> None:
        value = self.value

        if (min_value := self._min_value) is not None and value < min_value:
            raise self._validation_error(f"must be >= {min_value} (got {value})")

        if (max_value := self._max_value) is not None and value > max_value:
            raise self._validation_error(f"must be <= {max_value} (got {value})")


@dataclass(slots=True, frozen=True)
class IntegerField(BaseField[int]):
    """
    Base for all integer value objects.
    """

    _min_value: ClassVar[int | None]
    _max_value: ClassVar[int | None]

    @classmethod
    def random_value(cls) -> int:
        if (min_value := cls._min_value) is None:
            raise cls._random_value_error("_min_value")

        if (max_value := cls._max_value) is None:
            raise cls._random_value_error("_max_value")

        return random.randint(min_value, max_value)


@dataclass(slots=True, frozen=True)
class DecimalField(BaseField[float]):
    """
    Base for all decimal value objects.
    """

    _min_value: ClassVar[float | None]
    _max_value: ClassVar[float | None]

    @classmethod
    def random_value(cls) -> float:
        if (min_value := cls._min_value) is None:
            raise cls._random_value_error("_min_value")

        if (max_value := cls._max_value) is None:
            raise cls._random_value_error("_max_value")

        return random.uniform(min_value, max_value)
