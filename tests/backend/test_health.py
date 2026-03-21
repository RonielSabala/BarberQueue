"""
Tests for GET /api/health.
"""

import pytest
import requests

from api.client import ApiClient
from assertions import assert_body, assert_content_type, assert_status
from domain.dtos.app.responses import HealthResponse
from http_header import HttpHeader
from http_method import HttpMethod
from http_status import HttpStatus

BASE = "/api/health"


@pytest.fixture(scope="module")
def _response(client: ApiClient) -> requests.Response:
    return client.request(HttpMethod.GET, BASE)


def test_status(client: ApiClient, _response: requests.Response) -> None:
    """
    Health endpoint returns 200.
    """

    assert_status(_response, HttpStatus.OK)


def test_content_type(client: ApiClient, _response: requests.Response) -> None:
    """
    Health endpoint returns plain text content type.
    """

    assert_content_type(_response, HttpHeader.PLAIN_TEXT)


def test_body(client: ApiClient, _response: requests.Response) -> None:
    """
    Response contains an OK message.
    """

    expected_response = HealthResponse(message="OK")
    assert_body(_response, expected_response)
