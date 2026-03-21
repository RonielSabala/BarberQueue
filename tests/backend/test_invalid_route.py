"""
Tests for requests to unknown routes.
"""

import pytest
import requests

from api.client import ApiClient
from api_http import HttpHeader, HttpMethod, HttpStatus
from assertions import assert_body, assert_content_type, assert_status
from domain.dtos.base_response import ErrorResponse

BASE = "/api/this-route-does-not-exist"


@pytest.fixture(scope="module")
def _response(client: ApiClient) -> requests.Response:
    return client.request(HttpMethod.GET, BASE)


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

    expected_response = ErrorResponse(error="Route not found")
    assert_body(_response, expected_response)
