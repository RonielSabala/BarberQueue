"""
Tests for POST /api/auth/login
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.auth import LoginRequest, LoginResponse, RegisterRequest
from domain.value_objects import Password
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)

_INVALID_CREDENTIALS = ErrorResponse(error="Invalid credentials")


@pytest.fixture(scope="module")
def registered(client: ApiClient) -> LoginRequest:
    register_request = RegisterRequest.random()
    client.auth.register(register_request)
    return LoginRequest(
        email=register_request.email, password=register_request.password
    )


@pytest.fixture(scope="module")
def response(client: ApiClient, registered: LoginRequest) -> requests.Response:
    return client.auth.login(registered)


def test_status(response: requests.Response) -> None:
    """
    Successful login returns 200.
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

    assert_body_shape(response, LoginResponse)


def test_unknown_email(client: ApiClient) -> None:
    """
    Non-existent email returns 401.
    """

    request = LoginRequest.random()
    response = client.auth.login(request)

    assert_body(response, _INVALID_CREDENTIALS)
    assert_status(response, HttpStatus.UNAUTHORIZED)


def test_wrong_password(client: ApiClient, registered: LoginRequest) -> None:
    """
    Wrong password returns 401.
    """

    wrong_request = LoginRequest(
        email=registered.email, password=Password("wrongpassword123")
    )
    response = client.auth.login(wrong_request)

    assert_body(response, _INVALID_CREDENTIALS)
    assert_status(response, HttpStatus.UNAUTHORIZED)
