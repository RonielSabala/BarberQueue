from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass

from domain.exceptions import ValidationError


@dataclass(frozen=True)
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
    def random(cls) -> BaseField[T]: ...
