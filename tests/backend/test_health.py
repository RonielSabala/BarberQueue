"""
Tests for GET /api/health.
"""

import requests

from api.client import ApiClient
from assertions import assert_body, assert_content_type, assert_status
from domain.dtos.app.responses import HealthResponse
from http_header import HttpHeader
from http_method import HttpMethod
from http_status import HttpStatus

BASE = "/api/health"


def _get_response(client: ApiClient) -> requests.Response:
    return client.request(HttpMethod.GET, BASE)


def test_status(client: ApiClient) -> None:
    """
    Health endpoint returns 200.
    """

    response = _get_response(client)
    assert_status(response, HttpStatus.OK)


def test_content_type(client: ApiClient) -> None:
    """
    Health endpoint returns plain text content type.
    """

    response = _get_response(client)
    assert_content_type(response, HttpHeader.PLAIN_TEXT)


def test_body(client: ApiClient) -> None:
    """
    Health endpoint body matches expected payload.
    """

    response = _get_response(client)
    expected_response = HealthResponse(message="OK")
    assert_body(response, expected_response)
