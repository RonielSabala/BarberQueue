from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass
from typing import Any, Self

import requests

from domain.dtos import BaseDto
from domain.utils import to_camel_case
from helpers.unwrap_type import unwrap_list_of


@dataclass(frozen=True)
class BaseResponse(BaseDto):
    """
    Base response DTO.
    """

    @staticmethod
    def _get_subclass_from(hint: Any) -> type[BaseResponse] | None:
        return (
            hint if isinstance(hint, type) and issubclass(hint, BaseResponse) else None
        )

    @classmethod
    def _from_json(cls, data: dict) -> Self:
        kwargs = {}

        for field_info in cls.class_fields():
            field_name = field_info.field_name
            json_key = to_camel_case(field_name)
            if json_key not in data:
                raise ValueError(
                    f"Missing key {json_key} in response for {cls.__name__}"
                )

            json_value = data.pop(json_key)
            if json_value is None:
                kwargs[field_name] = None
                continue

            field_value = json_value
            field_type = field_info.field_type
            list_metadata = unwrap_list_of(field_type)

            if list_metadata is not None:
                item_type = cls._get_subclass_from(list_metadata.base_type)
                field_value = (
                    [item_type._from_json(item) for item in json_value]
                    if item_type is not None
                    else list(json_value)
                )
            elif (actual_type := cls._get_subclass_from(field_type)) is not None:
                field_value = actual_type._from_json(json_value)

            kwargs[field_name] = field_value

        if data:
            raise ValueError(f"Response contains extra keys: {tuple(data.keys())}")

        return cls(**kwargs)

    @classmethod
    def from_response(cls, response: requests.Response) -> Self:
        return cls._from_json(response.json())

    @classmethod
    def from_array_response(cls, response: requests.Response) -> Iterator[Self]:
        data = response.json()
        if not isinstance(data, list):
            raise ValueError(f"Expected array response for {cls.__name__}")

        return (cls._from_json(item) for item in data)


@dataclass(slots=True, kw_only=True, frozen=True)
class MessageResponse(BaseResponse):
    message: str


@dataclass(slots=True, kw_only=True, frozen=True)
class ErrorResponse(BaseResponse):
    error: str
