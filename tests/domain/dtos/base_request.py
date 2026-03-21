from dataclasses import dataclass, fields
from typing import Protocol

from domain.dtos import BaseDto


class Randomizable(Protocol):
    @classmethod
    def random(cls) -> type: ...


@dataclass(frozen=True)
class BaseRequest(BaseDto):
    """
    Base request DTO.
    """

    @classmethod
    def random(cls):
        kwargs = {}
        for field in fields(cls):
            field_type: Randomizable = field.type  # type: ignore
            kwargs[field.name] = field_type.random()

        return cls(**kwargs)
