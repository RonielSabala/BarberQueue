"""
Reusable assertion helpers for API response testing.
"""

from typing import Any, Protocol

import requests

from api.core import HttpHeader, HttpStatus
from domain.dtos import BaseResponse
from domain.utils import to_camel_case


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
        f"Expected '{name_on_error!r}' to be {expected.__name__}, got {type(value).__name__}"
    )


def _assert_shape(json: dict, response_class: type[BaseResponse]) -> None:
    for field_name, field_type, _ in response_class.iter_field_types():
        json_key = to_camel_case(field_name)
        assert json_key in json, f"Missing key '{json_key!r}' in response"

        value = json[json_key]
        if not issubclass(field_type, BaseResponse):
            assert_type(value, field_type, name_on_error=json_key)
            return

        assert_type(value, dict, name_on_error=json_key)
        _assert_shape(value, field_type)


def assert_body_shape(
    response: requests.Response, expected: type[BaseResponse]
) -> None:
    _assert_shape(response.json(), expected)


def assert_list_body_shape(
    response: requests.Response, expected: type[BaseResponse]
) -> None:
    data = response.json()
    assert_type(data, list, name_on_error="Response body")

    for i, item in enumerate(data):
        assert_type(item, dict, name_on_error=f"Response body[{i}]")
        _assert_shape(item, expected)
