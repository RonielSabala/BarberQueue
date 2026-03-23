"""
Tests for POST /api/auth/forgot-password
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos.auth import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    RegisterRequest,
)
from helpers.assertions import assert_body, assert_content_type, assert_status

_RECOVERY_EMAIL_SENT = ForgotPasswordResponse(message="Recovery email sent")


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    register_request = RegisterRequest.random()
    client.auth.register(register_request)

    request = ForgotPasswordRequest(email=register_request.email)
    return client.auth.forgot_password(request)


def test_status_on_known_email(response: requests.Response) -> None:
    """
    Known email returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_status_on_unknown_email(client: ApiClient) -> None:
    """
    Unknown email also returns 200.
    """

    request = ForgotPasswordRequest.random()
    response = client.auth.forgot_password(request)
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

    assert_body(response, _RECOVERY_EMAIL_SENT)
