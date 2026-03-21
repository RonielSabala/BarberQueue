from dataclasses import dataclass, fields

from domain.dtos.base import BaseDto
from domain.value_objects.base import BaseField


@dataclass(slots=True, kw_only=True, frozen=True)
class BaseRequest(BaseDto):
    """
    Base request DTO.
    """

    @classmethod
    def random(cls):
        kwargs = {}
        for field in fields(cls):
            field_type: BaseField = field.type  # type: ignore
            kwargs[field.name] = field_type.random()

        return cls(**kwargs)
