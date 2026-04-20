"""
Tests for GET /api/users
"""

import random

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos.auth import RegisterRequest
from domain.dtos.users import GetUserResponse
from domain.enums import RoleEnum
from domain.value_objects import Email, Username
from helpers.assertions import (
    assert_content_type,
    assert_empty_body_array,
    assert_list_body_shape,
    assert_status,
)


def _get_registered_request(client: ApiClient) -> RegisterRequest:
    request = RegisterRequest.random()
    client.auth.register(request)
    return request


def _get_registered_username(client: ApiClient) -> str:
    return _get_registered_request(client).username.value


def _get_registered_email(client: ApiClient) -> str:
    return _get_registered_request(client).email.value


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    return client.users.get_all()


def test_status(response: requests.Response) -> None:
    """
    Successful user listing returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_list_body_shape(response, GetUserResponse)


def test_returns_multiple_users(response: requests.Response) -> None:
    """
    Response includes the seeded users from the test database.
    """

    users = tuple(GetUserResponse.from_array_response(response))
    assert len(users) > 1


# Username filter


def test_username_filter_returns_matching_user(client: ApiClient) -> None:
    """
    Filtering by username returns only users whose username matches.
    """

    username = _get_registered_username(client)
    response = client.users.get_all(username=username)
    users = GetUserResponse.from_array_response(response)
    assert any(user.username == username for user in users)


def test_username_filter_is_case_sensitive(client: ApiClient) -> None:
    """
    Username filter does not match when casing is different.
    """

    username = _get_registered_username(client)
    altered_username = username.upper()

    response = client.users.get_all(username=altered_username)
    users = GetUserResponse.from_array_response(response)
    assert all(user.username != altered_username for user in users)


def test_username_filter_no_results(client: ApiClient) -> None:
    """
    Filtering by a username that does not exist returns an empty list.
    """

    response = client.users.get_all(username=Username.random_value())
    assert_empty_body_array(response)


# Email filter


def test_email_filter_returns_matching_user(client: ApiClient) -> None:
    """
    Filtering by email returns only the user with that exact email.
    """

    email = _get_registered_email(client)
    response = client.users.get_all(email=email)
    users = tuple(GetUserResponse.from_array_response(response))

    assert len(users) == 1
    assert users[0].email == email


def test_email_filter_no_results(client: ApiClient) -> None:
    """
    Filtering by an email that does not exist returns an empty list.
    """

    response = client.users.get_all(email=Email.random_value())
    assert_empty_body_array(response)


# Role filter


def test_role_filter(client: ApiClient) -> None:
    """
    Filtering by role returns only users with the client role.
    """

    random_role_value = random.choice(list(RoleEnum)).value
    response = client.users.get_all(role=random_role_value)
    users = tuple(GetUserResponse.from_array_response(response))

    assert len(users) > 0
    assert all(user.role == random_role_value for user in users)


def test_role_filter_no_results(client: ApiClient) -> None:
    """
    Filtering by a role value that does not exist returns an empty list.
    """

    response = client.users.get_all(role=Username.random_value())
    assert_empty_body_array(response)


# Combined filters


def test_username_and_role_filter_combined(client: ApiClient) -> None:
    """
    Combining username and role filters narrows the result to the matching user.
    """

    username = _get_registered_username(client)
    response = client.users.get_all(username=username, role=RoleEnum.CLIENT)
    users = tuple(GetUserResponse.from_array_response(response))

    assert len(users) == 1

    user = users[0]
    assert user.username == username
    assert user.role == RoleEnum.CLIENT


def test_username_and_role_mismatch_returns_empty(client: ApiClient) -> None:
    """
    Correct username but wrong role returns an empty list.
    """

    username = _get_registered_username(client)
    response = client.users.get_all(username=username, role=RoleEnum.ADMIN)
    assert_empty_body_array(response)
