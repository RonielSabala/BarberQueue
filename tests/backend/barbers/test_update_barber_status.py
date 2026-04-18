"""
Tests for PATCH /api/barbers/{id}/status
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID, get_fresh_barber_id
from domain.dtos import ErrorResponse, MessageResponse
from domain.dtos.barbers import UpdateBarberStatusRequest
from domain.enums import BarberStatusEnum
from domain.utils import random_bool
from helpers.assertions import assert_body, assert_content_type, assert_status
from helpers.common_responses import AT_LEAST_ONE_FIELD, BARBER_NOT_FOUND

_STATUS_UPDATED = MessageResponse(message="Barber status updated")
_INVALID_STATUS = ErrorResponse(
    error="BarberStatus must be one of: 'active', 'inactive', 'resting'"
)


@pytest.fixture(scope="module")
def barber_id(client: ApiClient) -> int:
    return get_fresh_barber_id(client)


@pytest.fixture(scope="module")
def response(client: ApiClient, barber_id: int) -> requests.Response:
    request = UpdateBarberStatusRequest.random(is_accepting=False)
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


def test_status_on_unknown_barber(client: ApiClient) -> None:
    """
    Unknown barber returns 404.
    """

    request = UpdateBarberStatusRequest.random(current_status=BarberStatusEnum.ACTIVE)
    response = client.barbers.update_status(NON_EXISTENT_ID, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)


def test_invalid_barber_status(client: ApiClient, barber_id: int) -> None:
    """
    Invalid barber status returns 422.
    """

    request = UpdateBarberStatusRequest.random(current_status="unknown barber status")
    response = client.barbers.update_status(barber_id, request)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _INVALID_STATUS)


def test_no_fields(client: ApiClient, barber_id: int) -> None:
    """
    Sending no fields returns 400.
    """

    status_request = UpdateBarberStatusRequest.random(optional_chance=0)
    response = client.barbers.update_status(barber_id, status_request)

    assert_status(response, HttpStatus.BAD_REQUEST)
    assert_body(response, AT_LEAST_ONE_FIELD)


def test_update_only_current_status_resting(client: ApiClient, barber_id: int) -> None:
    """
    Setting status to resting returns 200.
    """

    request = UpdateBarberStatusRequest.random(current_status=BarberStatusEnum.RESTING)
    response = client.barbers.update_status(barber_id, request)
    assert_status(response, HttpStatus.OK)


def test_update_only_current_status_inactive(client: ApiClient, barber_id: int) -> None:
    """
    Setting status to inactive returns 200.
    """

    request = UpdateBarberStatusRequest.random(current_status=BarberStatusEnum.INACTIVE)
    response = client.barbers.update_status(barber_id, request)
    assert_status(response, HttpStatus.OK)


def test_update_only_is_accepting(client: ApiClient, barber_id: int) -> None:
    """
    Updating only isAccepting returns 200.
    """

    is_accepting = random_bool()
    update_request = UpdateBarberStatusRequest.random(is_accepting=is_accepting)
    update_response = client.barbers.update_status(barber_id, update_request)
    get_response = client.barbers.get(barber_id)

    assert_status(update_response, HttpStatus.OK)
    assert get_response.json()["isAccepting"] == is_accepting
