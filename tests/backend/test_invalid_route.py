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
def _response(client: ApiClient) -> requests.Response:
    return client.request(HttpMethod.GET, "/api/this-route-does-not-exist")


def test_status(client: ApiClient, _response: requests.Response) -> None:
    """
    Unknown routes return 404.
    """

    assert_status(_response, HttpStatus.NOT_FOUND)


def test_content_type(client: ApiClient, _response: requests.Response) -> None:
    """
    Unknown routes return JSON content type.
    """

    assert_content_type(_response, HttpHeader.JSON)


def test_body(client: ApiClient, _response: requests.Response) -> None:
    """
    Response contains an error message.
    """

    assert_body(_response, _ROUTE_NOT_FOUND)
