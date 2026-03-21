"""
Tests for POST /api/auth/reset-password
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.auth.requests import ResetPasswordRequest
from helpers.assertions import assert_body, assert_status


@pytest.fixture(scope="module")
def _response(client: ApiClient) -> requests.Response:
    request = ResetPasswordRequest.random()
    return client.auth.reset_password(request)


def test_status_on_invalid_code(_response: requests.Response) -> None:
    """
    An invalid or expired code returns 400.
    """

    assert_status(_response, HttpStatus.BAD_REQUEST)


def test_body_on_invalid_code(_response: requests.Response) -> None:
    """
    Response contains an error message.
    """

    expected_response = ErrorResponse(error="Invalid or expired code")
    assert_body(_response, expected_response)
