"""
Tests for GET /api/health.
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpMethod, HttpStatus
from domain.dtos import MessageResponse
from helpers.assertions import assert_body, assert_content_type, assert_status

_OK = MessageResponse(message="OK")


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    return client.request(HttpMethod.GET, "/api/health")


def test_status(response: requests.Response) -> None:
    """
    Health endpoint returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Health endpoint returns plain text content type.
    """

    assert_content_type(response, HttpHeader.PLAIN_TEXT)


def test_body(response: requests.Response) -> None:
    """
    Response contains an OK message.
    """

    assert_body(response, _OK)
