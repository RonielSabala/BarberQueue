"""
Tests for POST /api/auth/reset-password
"""

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.auth import ResetPasswordRequest
from helpers.assertions import assert_body, assert_status


def test_invalid_code(client: ApiClient) -> None:
    """
    An invalid or expired code returns 400.
    """

    request = ResetPasswordRequest.random()
    response = client.auth.reset_password(request)
    expected_response = ErrorResponse(error="Invalid or expired code")

    assert_body(response, expected_response)
    assert_status(response, HttpStatus.BAD_REQUEST)
