"""
Tests for POST /api/auth/forgot-password
"""

import pytest

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos.auth import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    RegisterRequest,
)
from helpers.assertions import assert_body, assert_content_type, assert_status


@pytest.fixture(scope="module")
def _registered(client: ApiClient) -> ForgotPasswordRequest:
    register_request = RegisterRequest.random()
    client.auth.register(register_request)
    return ForgotPasswordRequest(email=register_request.email)


def test_status_known_email(
    client: ApiClient, _registered: ForgotPasswordRequest
) -> None:
    """
    Known email returns 200.
    """

    response = client.auth.forgot_password(_registered)
    assert_status(response, HttpStatus.OK)


def test_status_unknown_email(client: ApiClient) -> None:
    """
    Unknown email also returns 200.
    """

    request = ForgotPasswordRequest.random()
    response = client.auth.forgot_password(request)
    assert_status(response, HttpStatus.OK)


def test_content_type(client: ApiClient, _registered: ForgotPasswordRequest) -> None:
    """
    Response is JSON.
    """

    response = client.auth.forgot_password(_registered)
    assert_content_type(response, HttpHeader.JSON)


def test_body(client: ApiClient, _registered: ForgotPasswordRequest) -> None:
    """
    Response contains a confirmation message.
    """

    response = client.auth.forgot_password(_registered)
    expected_response = ForgotPasswordResponse(message="Recovery email sent")
    assert_body(response, expected_response)
