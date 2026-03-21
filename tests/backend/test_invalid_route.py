"""
Tests for requests to unknown routes.
"""

import requests

from api.client import ApiClient
from assertions import assert_body, assert_content_type, assert_status
from domain.dtos.app.responses import ErrorResponse
from http_header import HttpHeader
from http_method import HttpMethod
from http_status import HttpStatus

BASE = "/api/this-route-does-not-exist"


def _get_response(client: ApiClient) -> requests.Response:
    return client.request(HttpMethod.GET, BASE)


def test_status(client: ApiClient) -> None:
    """
    Unknown routes return 404.
    """

    response = _get_response(client)
    assert_status(response, HttpStatus.NOT_FOUND)


def test_content_type(client: ApiClient) -> None:
    """
    Unknown routes return JSON content type.
    """

    response = _get_response(client)
    assert_content_type(response, HttpHeader.JSON)


def test_body(client: ApiClient) -> None:
    """
    Unknown routes return a structured JSON error.
    """

    response = _get_response(client)
    expected_response = ErrorResponse(error="Route not found")
    assert_body(response, expected_response)
