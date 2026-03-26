from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Self

from domain.exceptions import ValidationError


@dataclass(slots=True, frozen=True)
class BaseField[T](ABC):
    """
    Root of all value objects.
    """

    value: T

    @classmethod
    @abstractmethod
    def random_value(cls) -> T: ...

    @classmethod
    def random(cls) -> Self:
        return cls(cls.random_value())

    @classmethod
    def _validation_error(cls, message: str) -> ValidationError:
        return ValidationError(f"{cls.__name__} {message}")

    @classmethod
    def _random_value_error(cls, name: str) -> NotImplementedError:
        return NotImplementedError(
            f"{cls.__name__}.random_value() requires {name} to be set"
        )
