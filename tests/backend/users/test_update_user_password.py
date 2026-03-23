"""
Tests for PATCH /api/users/{id}/password
"""

from dataclasses import dataclass

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.auth import LoginRequest, RegisterRequest
from domain.dtos.users import UpdateUserPasswordRequest
from domain.dtos.users.responses import UpdateUserPasswordResponse
from domain.value_objects import Password
from helpers.assertions import assert_body, assert_content_type, assert_status


@dataclass(slots=True, kw_only=True, frozen=True)
class Registered:
    user_id: int
    request: RegisterRequest


@dataclass(slots=True, kw_only=True, frozen=True)
class Operation:
    request: UpdateUserPasswordRequest
    register_request: RegisterRequest
    api_response: requests.Response


@pytest.fixture(scope="module")
def _registered(client: ApiClient) -> Registered:
    register_request = RegisterRequest.random()
    response = client.auth.register(register_request)
    return Registered(user_id=response.json()["id"], request=register_request)


@pytest.fixture(scope="module")
def _operation(client: ApiClient) -> Operation:
    register_request = RegisterRequest.random()
    request = UpdateUserPasswordRequest(
        current_password=register_request.password, new_password=Password.random()
    )

    register_response = client.auth.register(register_request)
    response = client.users.update_user_password(
        register_response.json()["id"], request
    )

    return Operation(
        request=request, register_request=register_request, api_response=response
    )


def test_status(_operation: Operation) -> None:
    """
    Successful password update returns 200.
    """

    assert_status(_operation.api_response, HttpStatus.OK)


def test_content_type(_operation: Operation) -> None:
    """
    Response is JSON.
    """

    assert_content_type(_operation.api_response, HttpHeader.JSON)


def test_body(_operation: Operation) -> None:
    """
    Response contains a confirmation message.
    """

    expected_response = UpdateUserPasswordResponse(message="Password updated")
    assert_body(_operation.api_response, expected_response)


def test_nonexistent_user(client: ApiClient) -> None:
    """
    Updating password of non-existent user returns 404.
    """

    request = UpdateUserPasswordRequest(
        current_password=Password.random(), new_password=Password.random()
    )

    response = client.users.update_user_password(999_999, request)
    expected_response = ErrorResponse(error="User not found")

    assert_body(response, expected_response)
    assert_status(response, HttpStatus.NOT_FOUND)


def test_wrong_current_password(client: ApiClient, _registered: Registered) -> None:
    """
    Wrong current password returns 422.
    """

    request = UpdateUserPasswordRequest(
        current_password=Password.random(), new_password=Password.random()
    )

    response = client.users.update_user_password(_registered.user_id, request)
    expected_response = ErrorResponse(error="Current password is incorrect")

    assert_body(response, expected_response)
    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)


def test_same_password(client: ApiClient, _registered: Registered) -> None:
    """
    New password identical to current returns 422.
    """

    password = _registered.request.password
    request = UpdateUserPasswordRequest(
        current_password=password, new_password=password
    )

    response = client.users.update_user_password(_registered.user_id, request)
    expected_response = ErrorResponse(
        error="New password must differ from the current one"
    )

    assert_body(response, expected_response)
    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)


def test_old_password(client: ApiClient, _operation: Operation) -> None:
    """
    After update, the old password is rejected.
    """

    register_request = _operation.register_request
    login_request = LoginRequest(
        email=register_request.email, password=register_request.password
    )

    response = client.auth.login(login_request)
    assert_status(response, HttpStatus.UNAUTHORIZED)


def test_new_password_works(client: ApiClient, _operation: Operation) -> None:
    """
    After update, the new password is accepted.
    """

    login_request = LoginRequest(
        email=_operation.register_request.email,
        password=_operation.request.new_password,
    )

    response = client.auth.login(login_request)
    assert_status(response, HttpStatus.OK)
