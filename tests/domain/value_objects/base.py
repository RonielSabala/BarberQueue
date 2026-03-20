from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True, frozen=True)
class BaseField[T]:
    """
    Root of all value objects.

    Subclasses validate in `__post_init__` and expose a `random()`
    factory.
    """

    value: T

    def _validation_error(self, message: str) -> ValueError:
        return ValueError(f"{self.__class__.__name__}: {message}")

    @classmethod
    def random(cls) -> BaseField[T]:
        raise NotImplementedError(f"{cls.__name__} must implement random()")
