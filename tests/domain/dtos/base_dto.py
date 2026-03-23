import dataclasses
from dataclasses import dataclass

from domain.utils import to_camel_case
from domain.value_objects.base_field import BaseField


@dataclass(frozen=True)
class BaseDto:
    """
    Base DTO class.
    """

    def to_json(self) -> dict:
        json = {}
        for field in dataclasses.fields(self):
            field_name = field.name
            key = to_camel_case(field_name)
            value = getattr(self, field_name)

            if isinstance(value, BaseDto):
                value = value.to_json()
            elif isinstance(value, BaseField):
                value = value.value

            json[key] = value

        return json
