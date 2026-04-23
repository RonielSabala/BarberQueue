"""
Tests for POST /api/auth/reset-password
"""

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.auth import ResetPasswordRequest
from helpers.assertions import assert_body, assert_status

_INVALID_OR_EXPIRED_CODE = ErrorResponse(error="Invalid or expired code")


def test_invalid_code(client: ApiClient) -> None:
    """
    An invalid code returns 400.
    """

    request = ResetPasswordRequest.random()
    response = client.auth.reset_password(request)

    assert_body(response, _INVALID_OR_EXPIRED_CODE)
    assert_status(response, HttpStatus.BAD_REQUEST)
