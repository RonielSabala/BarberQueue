"""
Tests for requests to unknown routes.
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpMethod, HttpStatus
from domain.dtos import ErrorResponse
from helpers.assertions import assert_body, assert_content_type, assert_status

_ROUTE_NOT_FOUND = ErrorResponse(error="Route not found")


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    return client.request(HttpMethod.GET, "/api/this-route-does-not-exist")


def test_status(response: requests.Response) -> None:
    """
    Unknown routes return 404.
    """

    assert_status(response, HttpStatus.NOT_FOUND)


def test_content_type(response: requests.Response) -> None:
    """
    Unknown routes return JSON content type.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body(response: requests.Response) -> None:
    """
    Response contains an error message.
    """

    assert_body(response, _ROUTE_NOT_FOUND)
