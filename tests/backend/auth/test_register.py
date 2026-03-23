"""
Tests for POST /api/auth/register
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.auth import RegisterRequest, UserResponse
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)

_EMAIL_ALREADY_IN_USE = ErrorResponse(error="Email already in use")


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    request = RegisterRequest.random()
    return client.auth.register(request)


def test_status(response: requests.Response) -> None:
    """
    Successful registration returns 201.
    """

    assert_status(response, HttpStatus.CREATED)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(response, UserResponse)


def test_role_is_client(response: requests.Response) -> None:
    """
    Registered users always get the client role.
    """

    body = response.json()
    assert body["role"] == "client"


def test_duplicate_email(client: ApiClient) -> None:
    """
    Registering the same email twice returns 409.
    """

    request = RegisterRequest.random()
    client.auth.register(request)
    response = client.auth.register(request)

    assert_body(response, _EMAIL_ALREADY_IN_USE)
    assert_status(response, HttpStatus.CONFLICT)
