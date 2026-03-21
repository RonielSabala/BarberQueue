"""
Reusable assertion helpers for API response testing.
"""

from dataclasses import fields
from typing import Protocol, get_type_hints

import requests

from domain.dtos.base import to_camel_case
from domain.dtos.base_response import BaseResponse
from http_header import HttpHeader
from http_status import HttpStatus


class JSONSerializable(Protocol):
    def to_json(self) -> dict: ...


def assert_status(response: requests.Response, status: HttpStatus) -> None:
    assert response.status_code == status


def assert_content_type(response: requests.Response, header: HttpHeader) -> None:
    assert response.headers.get("Content-Type") == header.with_charset


def assert_body(response: requests.Response, expected: JSONSerializable) -> None:
    assert response.json() == expected.to_json()


def assert_body_shape(
    response: requests.Response, expected: type[BaseResponse]
) -> None:
    _assert_shape(response.json(), expected)


def _assert_shape(data: dict, response_class: type[BaseResponse]) -> None:
    hints = get_type_hints(response_class)

    for field in fields(response_class):
        key = to_camel_case(field.name)
        expected_type = hints[field.name]

        assert key in data, f"Missing key {key!r} in response"

        value = data[key]
        if not isinstance(expected_type, type) or not issubclass(
            expected_type, BaseResponse
        ):
            assert isinstance(value, expected_type), (
                f"Expected {key!r} to be {expected_type.__name__}, got {type(value).__name__}"
            )

            return

        assert isinstance(value, dict), (
            f"Expected {key!r} to be a dict, got {type(value).__name__}"
        )

        _assert_shape(value, expected_type)
