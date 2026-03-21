"""
Tests for POST /api/auth/forgot-password
"""

import pytest

from api.client import ApiClient
from assertions import assert_body, assert_content_type, assert_status
from domain.dtos.auth.requests import ForgotPasswordRequest, RegisterRequest
from domain.dtos.auth.responses import ForgotPasswordResponse
from http_header import HttpHeader
from http_status import HttpStatus


@pytest.fixture(scope="module")
def _request(client: ApiClient) -> ForgotPasswordRequest:
    register_request = RegisterRequest.random()
    client.auth.register(register_request)
    return ForgotPasswordRequest(email=register_request.email)


def test_status_known_email(client: ApiClient, _request: ForgotPasswordRequest) -> None:
    """
    Known email returns 200.
    """

    response = client.auth.forgot_password(_request)
    assert_status(response, HttpStatus.OK)


def test_status_unknown_email(client: ApiClient) -> None:
    """
    Unknown email also returns 200.
    """

    request = ForgotPasswordRequest.random()
    response = client.auth.forgot_password(request)
    assert_status(response, HttpStatus.OK)


def test_content_type(client: ApiClient, _request: ForgotPasswordRequest) -> None:
    """
    Response is JSON.
    """

    response = client.auth.forgot_password(_request)
    assert_content_type(response, HttpHeader.JSON)


def test_body(client: ApiClient, _request: ForgotPasswordRequest) -> None:
    """
    Response contains a confirmation message.
    """

    response = client.auth.forgot_password(_request)
    expected_response = ForgotPasswordResponse(message="Recovery email sent")
    assert_body(response, expected_response)
