"""
Tests for GET /api/health.
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpMethod, HttpStatus
from domain.dtos.health import HealthResponse
from helpers.assertions import assert_body, assert_content_type, assert_status

_OK = HealthResponse(message="OK")


@pytest.fixture(scope="module")
def _response(client: ApiClient) -> requests.Response:
    return client.request(HttpMethod.GET, "/api/health")


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

    assert_body(_response, _OK)
