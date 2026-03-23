"""
Tests for GET /api/users/{id}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.auth import RegisterRequest
from domain.dtos.users import GetUserResponse
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)


@pytest.fixture(scope="module")
def _response(client: ApiClient) -> requests.Response:
    register_response = client.auth.register(RegisterRequest.random())
    user_id = register_response.json()["id"]
    return client.users.get_user(user_id)


def test_status(_response: requests.Response) -> None:
    """
    Successful user profile returns 200.
    """

    assert_status(_response, HttpStatus.OK)


def test_content_type(_response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(_response, HttpHeader.JSON)


def test_body_shape(_response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(_response, GetUserResponse)


def test_non_existing_user(client: ApiClient) -> None:
    """
    Non-existent user returns 404.
    """

    response = client.users.get_user(999_999)
    expected_response = ErrorResponse(error="User not found")

    assert_body(response, expected_response)
    assert_status(response, HttpStatus.NOT_FOUND)
