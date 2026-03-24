from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Self

from domain.exceptions import ValidationError


@dataclass(slots=True, frozen=True)
class BaseField[T](ABC):
    """
    Root of all value objects.

    Subclasses validate in `__post_init__` and expose a `random()`
    factory.
    """

    value: T

    @classmethod
    def _validation_error(cls, message: str) -> ValidationError:
        return ValidationError(f"{cls.__name__} {message}")

    @classmethod
    @abstractmethod
    def random_value(cls) -> T: ...

    @classmethod
    def random(cls) -> Self:
        return cls(cls.random_value())
