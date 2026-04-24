"""
Tests for PATCH /api/users/{id}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID, get_fresh_client_id
from domain.dtos import MessageResponse
from domain.dtos.users import GetUserResponse, UpdateUserRequest
from domain.value_objects import Username
from helpers.assertions import assert_body, assert_content_type, assert_status
from helpers.common_responses import AT_LEAST_ONE_FIELD, USER_NOT_FOUND

_USER_UPDATED = MessageResponse(message="User updated")


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    request = UpdateUserRequest.random()
    if request.all_none:
        request = UpdateUserRequest(
            username=Username.random(), email=None, phone=None, photo_url=None
        )

    user_id = get_fresh_client_id(client)
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


def test_updated_fields_persists(client: ApiClient) -> None:
    """
    Updated fields must persists.
    """

    user_id = get_fresh_client_id(client)
    request = UpdateUserRequest.random()
    client.users.update_user(user_id, request)

    user_response = client.users.get_user(user_id)
    user = GetUserResponse.from_response(user_response)

    assert request.username is None or user.username == request.username.value
    assert request.email is None or user.email == request.email.value
    assert request.phone is None or user.phone == request.phone.value


def test_nonexistent_user(client: ApiClient) -> None:
    """
    Updating a non-existent user returns 404.
    """

    request = UpdateUserRequest.random(optional_chance=0)
    response = client.users.update_user(NON_EXISTENT_ID, request)

    assert_body(response, USER_NOT_FOUND)
    assert_status(response, HttpStatus.NOT_FOUND)


def test_no_fields(client: ApiClient) -> None:
    """
    Sending no fields returns 400.
    """

    user_id = get_fresh_client_id(client)
    request = UpdateUserRequest.random(optional_chance=0)
    response = client.users.update_user(user_id, request)

    assert_body(response, AT_LEAST_ONE_FIELD)
    assert_status(response, HttpStatus.BAD_REQUEST)
