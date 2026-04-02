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
def client_response(client: ApiClient) -> requests.Response:
    return client.request(HttpMethod.GET, "/api/health")


def test_status(client: ApiClient, client_response: requests.Response) -> None:
    """
    Health endpoint returns 200.
    """

    assert_status(client_response, HttpStatus.OK)


def test_content_type(client: ApiClient, client_response: requests.Response) -> None:
    """
    Health endpoint returns plain text content type.
    """

    assert_content_type(client_response, HttpHeader.PLAIN_TEXT)


def test_body(client: ApiClient, client_response: requests.Response) -> None:
    """
    Response contains an OK message.
    """

    assert_body(client_response, _OK)
