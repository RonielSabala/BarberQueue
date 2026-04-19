"""
Tests for PATCH /api/users/{id}/password
"""

from dataclasses import dataclass

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import ErrorResponse, MessageResponse
from domain.dtos.auth import LoginRequest, RegisterRequest, UserResponse
from domain.dtos.users import UpdateUserPasswordRequest
from domain.value_objects import Password
from helpers.assertions import assert_body, assert_content_type, assert_status
from helpers.common_responses import USER_NOT_FOUND

_PASSWORD_UPDATED = MessageResponse(message="Password updated")
_CURRENT_PASSWORD_IS_INCORRECT = ErrorResponse(error="Current password is incorrect")
_NEW_PASSWORD_MUST_BE_DIFFERENT = ErrorResponse(
    error="New password must differ from the current one"
)


@dataclass(slots=True, kw_only=True, frozen=True)
class Registered:
    user_id: int
    request: RegisterRequest


@dataclass(slots=True, kw_only=True, frozen=True)
class PasswordUpdate:
    request: UpdateUserPasswordRequest
    register_request: RegisterRequest
    api_response: requests.Response


@pytest.fixture(scope="module")
def registered(client: ApiClient) -> Registered:
    register_request = RegisterRequest.random()
    response = client.auth.register(register_request)
    user = UserResponse.from_response(response)
    return Registered(user_id=user._id, request=register_request)


@pytest.fixture(scope="module")
def password_update(client: ApiClient) -> PasswordUpdate:
    register_request = RegisterRequest.random()
    request = UpdateUserPasswordRequest(
        current_password=register_request.password, new_password=Password.random()
    )

    register_response = client.auth.register(register_request)
    user = UserResponse.from_response(register_response)

    response = client.users.update_user_password(user._id, request)
    return PasswordUpdate(
        request=request, register_request=register_request, api_response=response
    )


def test_status(password_update: PasswordUpdate) -> None:
    """
    Successful password update returns 200.
    """

    assert_status(password_update.api_response, HttpStatus.OK)


def test_content_type(password_update: PasswordUpdate) -> None:
    """
    Response is JSON.
    """

    assert_content_type(password_update.api_response, HttpHeader.JSON)


def test_body(password_update: PasswordUpdate) -> None:
    """
    Response contains a confirmation message.
    """

    assert_body(password_update.api_response, _PASSWORD_UPDATED)


def test_nonexistent_user(client: ApiClient) -> None:
    """
    Updating password of non-existent user returns 404.
    """

    request = UpdateUserPasswordRequest(
        current_password=Password.random(), new_password=Password.random()
    )
    response = client.users.update_user_password(NON_EXISTENT_ID, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, USER_NOT_FOUND)


def test_wrong_current_password(client: ApiClient, registered: Registered) -> None:
    """
    Wrong current password returns 422.
    """

    request = UpdateUserPasswordRequest(
        current_password=Password.random(), new_password=Password.random()
    )
    response = client.users.update_user_password(registered.user_id, request)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _CURRENT_PASSWORD_IS_INCORRECT)


def test_same_password(client: ApiClient, registered: Registered) -> None:
    """
    New password identical to current returns 422.
    """

    password = registered.request.password
    request = UpdateUserPasswordRequest(
        current_password=password, new_password=password
    )
    response = client.users.update_user_password(registered.user_id, request)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _NEW_PASSWORD_MUST_BE_DIFFERENT)


def test_old_password(client: ApiClient, password_update: PasswordUpdate) -> None:
    """
    After update, the old password is rejected.
    """

    register_request = password_update.register_request
    login_request = LoginRequest(
        email=register_request.email, password=register_request.password
    )

    response = client.auth.login(login_request)
    assert_status(response, HttpStatus.UNAUTHORIZED)


def test_new_password_works(client: ApiClient, password_update: PasswordUpdate) -> None:
    """
    After update, the new password is accepted.
    """

    login_request = LoginRequest(
        email=password_update.register_request.email,
        password=password_update.request.new_password,
    )

    response = client.auth.login(login_request)
    assert_status(response, HttpStatus.OK)
