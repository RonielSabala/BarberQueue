"""
Tests for PATCH /api/users/{id}
"""

import dataclasses

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos import ErrorResponse, MessageResponse
from domain.dtos.auth import RegisterRequest
from domain.dtos.users import UpdateUserRequest
from domain.utils import to_camel_case
from domain.value_objects.base_field import BaseField
from helpers.assertions import assert_body, assert_content_type, assert_status
from helpers.common_responses import USER_NOT_FOUND

_USER_UPDATED = MessageResponse(message="User updated")
_ONE_FIELD_MUST_BE_PROVIDED = ErrorResponse(error="At least one field must be provided")


@pytest.fixture(scope="module")
def user_id(client: ApiClient) -> int:
    register_request = RegisterRequest.random()
    response = client.auth.register(register_request)
    return response.json()["id"]


@pytest.fixture(scope="module")
def response(client: ApiClient, user_id: int) -> requests.Response:
    request = UpdateUserRequest.random()
    return client.users.update_user(user_id, request)


def test_status(response: requests.Response) -> None:
    """
    Successful update returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body(response: requests.Response) -> None:
    """
    Response contains a confirmation message.
    """

    assert_body(response, _USER_UPDATED)


def test_updated_fields_persists(client: ApiClient, user_id: int) -> None:
    """
    Updated fields must persists.
    """

    request = UpdateUserRequest.random()
    client.users.update_user(user_id, request)

    user_body = client.users.get_user(user_id).json()

    for field in dataclasses.fields(request):
        field_name = field.name
        field_value: BaseField | None = getattr(request, field_name)
        if field_value is None:
            continue

        json_key = to_camel_case(field_name)
        assert user_body[json_key] == field_value.value


def test_nonexistent_user(client: ApiClient) -> None:
    """
    Updating a non-existent user returns 404.
    """

    request = UpdateUserRequest.random(optional_chance=0)
    response = client.users.update_user(999_999, request)

    assert_body(response, USER_NOT_FOUND)
    assert_status(response, HttpStatus.NOT_FOUND)


def test_no_fields(client: ApiClient, user_id: int) -> None:
    """
    Sending no fields returns 400.
    """

    request = UpdateUserRequest.random(optional_chance=0)
    response = client.users.update_user(user_id, request)

    assert_body(response, _ONE_FIELD_MUST_BE_PROVIDED)
    assert_status(response, HttpStatus.BAD_REQUEST)
