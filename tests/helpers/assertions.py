"""
Reusable assertion helpers for API response testing.
"""

from typing import Any, Protocol

import requests

from api.core import HttpHeader, HttpStatus
from domain.dtos import BaseResponse
from domain.utils import to_camel_case
from helpers.unwrap_type import unwrap_list_of


class JSONSerializable(Protocol):
    def to_json(self) -> dict: ...


def assert_status(response: requests.Response, status: HttpStatus) -> None:
    assert response.status_code == status


def assert_content_type(response: requests.Response, header: HttpHeader) -> None:
    assert response.headers.get("Content-Type") == header.with_charset


def assert_body(response: requests.Response, expected: JSONSerializable) -> None:
    assert response.json() == expected.to_json()


def assert_type(value: Any, expected: type, *, name_on_error: str) -> None:
    assert isinstance(value, expected), (
        f"Expected {name_on_error!r} to be <{expected.__name__}>, got <{type(value).__name__}>"
    )


def _assert_shape(json: dict, response_class: type[BaseResponse]) -> None:
    for field_info in response_class.class_fields():
        # Validate key exists
        json_key = to_camel_case(field_info.field_name)
        assert json_key in json, f"Missing key {json_key!r} in response"

        # Skip optional key
        json_value = json[json_key]
        if json_value is None and field_info.is_optional:
            continue

        # Validate array shape
        field_type = field_info.field_type
        list_metadata = unwrap_list_of(field_type)
        if list_metadata:
            min_items = list_metadata.min_items
            assert min_items is None or len(json_value) >= min_items

            max_items = list_metadata.max_items
            assert max_items is None or len(json_value) <= max_items

            _assert_list_shape(json_value, list_metadata.base_type)
            continue

        if not isinstance(field_type, type):
            raise ValueError(f"field_type '{field_type}' is not a valid type")

        # Validate nested object
        if issubclass(field_type, BaseResponse):
            assert_type(json_value, dict, name_on_error=json_key)
            _assert_shape(json_value, field_type)
            continue

        # Validate key type
        assert_type(json_value, field_type, name_on_error=json_key)


def _assert_list_shape(data: list, expected: Any) -> None:
    assert_type(data, list, name_on_error="Response body")

    list_of_objects = isinstance(expected, type) and issubclass(expected, BaseResponse)
    for i, item in enumerate(data):
        if not list_of_objects:
            assert_type(item, expected, name_on_error="List item")
            continue

        assert_type(item, dict, name_on_error=f"Response body[{i}]")
        _assert_shape(item, expected)


def assert_body_shape(
    response: requests.Response, expected: type[BaseResponse]
) -> None:
    _assert_shape(response.json(), expected)


def assert_list_body_shape(
    response: requests.Response, expected: type[BaseResponse]
) -> None:
    _assert_list_shape(response.json(), expected)
