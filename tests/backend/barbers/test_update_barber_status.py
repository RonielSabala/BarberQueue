"""
Tests for PATCH /api/barbers/{id}/status
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos import ErrorResponse, MessageResponse
from domain.dtos.barbers import UpdateBarberStatusRequest
from domain.value_objects import BarberStatus
from helpers.assertions import assert_body, assert_content_type, assert_status
from helpers.common_responses import BARBER_NOT_FOUND

_STATUS_UPDATED = MessageResponse(message="Barber status updated")
_INVALID_STATUS = ErrorResponse(
    error="BarberCurrentStatus must be one of: 'active', 'inactive', 'resting'"
)


@pytest.fixture(scope="module")
def response(client: ApiClient, barber_id: int) -> requests.Response:
    request = UpdateBarberStatusRequest.random(status=BarberStatus.ACTIVE)
    return client.barbers.update_status(barber_id, request)


def test_status(response: requests.Response) -> None:
    """
    Successful status update returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body(response: requests.Response) -> None:
    """
    Response contains a confirmation message.
    """

    assert_body(response, _STATUS_UPDATED)


def test_status_resting(client: ApiClient, barber_id: int) -> None:
    """
    Setting status to resting returns 200.
    """

    request = UpdateBarberStatusRequest.random(status=BarberStatus.RESTING)
    response = client.barbers.update_status(barber_id, request)
    assert_status(response, HttpStatus.OK)


def test_status_inactive(client: ApiClient, barber_id: int) -> None:
    """
    Setting status to inactive returns 200.
    """

    request = UpdateBarberStatusRequest.random(status=BarberStatus.INACTIVE)
    response = client.barbers.update_status(barber_id, request)
    assert_status(response, HttpStatus.OK)


def test_status_on_unknown_barber(client: ApiClient) -> None:
    """
    Unknown barber returns 404.
    """

    request = UpdateBarberStatusRequest.random(status=BarberStatus.ACTIVE)
    response = client.barbers.update_status(999_999, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)


def test_invalid_barber_status(client: ApiClient, barber_id: int) -> None:
    """
    Invalid barber status returns 422.
    """

    request = UpdateBarberStatusRequest.random(status="unknown barber status")
    response = client.barbers.update_status(barber_id, request)

    print(response.json())

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _INVALID_STATUS)
