"""
Tests for GET /api/barbers/{id}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos.auth import RegisterRequest
from domain.dtos.barbers import BarberResponse
from domain.value_objects import BarberStatus
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import BARBER_NOT_FOUND


@pytest.fixture(scope="module")
def response(client: ApiClient, barber_id: int) -> requests.Response:
    return client.barbers.get(barber_id)


def test_status(response: requests.Response) -> None:
    """
    Successful barber profile returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(response, BarberResponse)


def test_current_status_is_valid(response: requests.Response) -> None:
    """
    currentStatus is one of the valid enum values.
    """

    current_status = response.json()["currentStatus"]
    assert BarberStatus.has_value(current_status)


def test_status_on_unknown_barber(client: ApiClient) -> None:
    """
    Unknown barber returns 404.
    """

    response = client.barbers.get(999_999)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)


def test_status_on_non_barber_user(client: ApiClient) -> None:
    """
    Requesting a non-barber user returns 404.
    """

    register_response = client.auth.register(RegisterRequest.random())
    client_id = register_response.json()["id"]
    response = client.barbers.get(client_id)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)
