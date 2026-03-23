"""
Tests for PATCH /api/users/{id}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.auth import RegisterRequest
from domain.dtos.users import UpdateUserRequest, UpdateUserResponse
from domain.utils import to_camel_case
from domain.value_objects import Email, Phone, Username
from domain.value_objects.base_field import BaseField
from helpers.assertions import assert_body, assert_content_type, assert_status


@pytest.fixture(scope="module")
def _user_id(client: ApiClient) -> int:
    register_request = RegisterRequest.random()
    response = client.auth.register(register_request)
    return response.json()["id"]


@pytest.fixture(scope="module")
def _response(client: ApiClient, _user_id: int) -> requests.Response:
    request = UpdateUserRequest(username=Username.random(), email=None, phone=None)
    return client.users.update_user(_user_id, request)


def _assert_field_persists(client: ApiClient, user_id: int, field: BaseField):
    json_key = to_camel_case(field.__class__.__name__)
    response = client.users.get_user(user_id)
    assert response.json()[json_key] == field.value


def test_status_on_update_username(client: ApiClient, _user_id: int) -> None:
    """
    Updating only username returns 200.
    """

    username = Username.random()
    request = UpdateUserRequest(username=username, email=None, phone=None)
    response = client.users.update_user(_user_id, request)

    assert_status(response, HttpStatus.OK)
    _assert_field_persists(client, _user_id, username)


def test_status_on_update_email(client: ApiClient, _user_id: int) -> None:
    """
    Updating only email returns 200.
    """

    email = Email.random()
    request = UpdateUserRequest(username=None, email=email, phone=None)
    response = client.users.update_user(_user_id, request)

    assert_status(response, HttpStatus.OK)
    _assert_field_persists(client, _user_id, email)


def test_status_on_update_phone(client: ApiClient, _user_id: int) -> None:
    """
    Updating only phone returns 200.
    """

    phone = Phone.random()
    request = UpdateUserRequest(username=None, email=None, phone=phone)
    response = client.users.update_user(_user_id, request)

    assert_status(response, HttpStatus.OK)
    _assert_field_persists(client, _user_id, phone)


def test_status_on_update_all_fields(client: ApiClient, _user_id: int) -> None:
    """
    Updating all fields at once returns 200.
    """

    username = Username.random()
    email = Email.random()
    phone = Phone.random()

    request = UpdateUserRequest(username=username, email=email, phone=phone)
    response = client.users.update_user(_user_id, request)

    assert_status(response, HttpStatus.OK)
    _assert_field_persists(client, _user_id, username)
    _assert_field_persists(client, _user_id, email)
    _assert_field_persists(client, _user_id, phone)


def test_content_type(_response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(_response, HttpHeader.JSON)


def test_body(_response: requests.Response) -> None:
    """
    Response contains a confirmation message.
    """

    expected_response = UpdateUserResponse(message="User updated")
    assert_body(_response, expected_response)


def test_nonexistent_user(client: ApiClient) -> None:
    """
    Updating a non-existent user returns 404.
    """

    request = UpdateUserRequest(username=None, email=None, phone=None)
    response = client.users.update_user(999_999, request)
    expected_response = ErrorResponse(error="User not found")

    assert_body(response, expected_response)
    assert_status(response, HttpStatus.NOT_FOUND)


def test_no_fields(client: ApiClient, _user_id: int) -> None:
    """
    Sending no fields returns 400.
    """

    request = UpdateUserRequest(username=None, email=None, phone=None)

    response = client.users.update_user(_user_id, request)
    expected_response = ErrorResponse(error="At least one field must be provided")

    assert_body(response, expected_response)
    assert_status(response, HttpStatus.BAD_REQUEST)
