"""
Tests for POST /api/auth/reset-password
"""

import pytest
import requests

from api.client import ApiClient
from assertions import assert_body, assert_status
from domain.dtos.app.responses import ErrorResponse
from domain.dtos.auth.requests import ResetPasswordRequest
from http_status import HttpStatus


@pytest.fixture(scope="module")
def _response(client: ApiClient) -> requests.Response:
    request = ResetPasswordRequest.random()
    return client.auth.reset_password(request)


def test_invalid_code_returns_bad_request(_response: requests.Response) -> None:
    """
    An invalid or expired reset code returns 400.
    """

    assert_status(_response, HttpStatus.BAD_REQUEST)


def test_body_on_invalid_code(_response: requests.Response) -> None:
    """
    Invalid code response contains an error field.
    """

    expected_response = ErrorResponse(error="Invalid or expired code")
    assert_body(_response, expected_response)
