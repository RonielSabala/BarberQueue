"""
Tests for POST /api/auth/login
"""

import pytest

from api.client import ApiClient
from assertions import assert_body_shape, assert_content_type, assert_status
from domain.dtos.auth.requests import LoginRequest, RegisterRequest
from domain.dtos.auth.responses import LoginResponse
from domain.value_objects.password import Password
from http_header import HttpHeader
from http_status import HttpStatus


@pytest.fixture(scope="module")
def _request(client: ApiClient) -> LoginRequest:
    register_request = RegisterRequest.random()
    client.auth.register(register_request)
    return LoginRequest(
        email=register_request.email, password=register_request.password
    )


def test_status(client: ApiClient, _request: LoginRequest) -> None:
    """
    Successful login returns 200.
    """

    response = client.auth.login(_request)
    assert_status(response, HttpStatus.OK)


def test_content_type(client: ApiClient, _request: LoginRequest) -> None:
    """
    Response is JSON.
    """

    response = client.auth.login(_request)
    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(client: ApiClient, _request: LoginRequest) -> None:
    """
    Response contains expected fields.
    """

    response = client.auth.login(_request)
    assert_body_shape(response, LoginResponse)


def test_unknown_email_returns_unauthorized(client: ApiClient) -> None:
    """
    Non-existent email returns 401.
    """

    request = LoginRequest.random()
    response = client.auth.login(request)
    assert_status(response, HttpStatus.UNAUTHORIZED)


def test_wrong_password_returns_unauthorized(
    client: ApiClient, _request: LoginRequest
) -> None:
    """
    Wrong password returns 401.
    """

    wrong_request = LoginRequest(
        email=_request.email, password=Password("wrongpassword123")
    )

    response = client.auth.login(wrong_request)
    assert_status(response, HttpStatus.UNAUTHORIZED)
