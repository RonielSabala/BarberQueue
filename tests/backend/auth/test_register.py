"""
Tests for POST /api/auth/register
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos.auth.requests import RegisterRequest
from domain.dtos.auth.responses import UserResponse
from domain.dtos.base_response import ErrorResponse
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)


@pytest.fixture(scope="module")
def _response(client: ApiClient) -> requests.Response:
    request = RegisterRequest.random()
    return client.auth.register(request)


def test_status(_response: requests.Response) -> None:
    """
    Successful registration returns 201.
    """

    assert_status(_response, HttpStatus.CREATED)


def test_content_type(_response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(_response, HttpHeader.JSON)


def test_body_shape(_response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(_response, UserResponse)


def test_role_is_client(_response: requests.Response) -> None:
    """
    Registered users always get the client role.
    """

    body = _response.json()
    assert body["role"] == "client"


def test_status_on_duplicate_email(client: ApiClient) -> None:
    """
    Registering the same email twice returns 409.
    """

    request = RegisterRequest.random()
    client.auth.register(request)

    response = client.auth.register(request)
    assert_status(response, HttpStatus.CONFLICT)


def test_body_on_duplicate_email(client: ApiClient) -> None:
    """
    Response contains an error message.
    """

    request = RegisterRequest.random()
    client.auth.register(request)

    response = client.auth.register(request)
    assert_body(response, ErrorResponse(error="Email already in use"))
