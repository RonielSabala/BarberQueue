"""
Tests for GET /api/barbers/{id}/dashboard
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos.barbers import BarberDashboardResponse
from domain.dtos.base_response import ErrorResponse
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import BARBER_NOT_FOUND

_USER_NOT_A_BARBER = ErrorResponse(error="This user is not a barber")


@pytest.fixture(scope="module")
def response(client: ApiClient, barber_id: int) -> requests.Response:
    return client.barbers.get_dashboard(barber_id)


def test_status(response: requests.Response) -> None:
    """
    Successful barber dashboard returns 200.
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

    assert_body_shape(response, BarberDashboardResponse)


def test_status_on_unknown_barber(client: ApiClient) -> None:
    """
    Unknown barber returns 404.
    """

    response = client.barbers.get_dashboard(999_999)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)


def test_status_on_non_barber_user(client: ApiClient, client_id: int) -> None:
    """
    Requesting a non-barber user returns 404.
    """

    response = client.barbers.get_dashboard(client_id)
    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _USER_NOT_A_BARBER)


def test_total_attended_clients_is_non_negative(response: requests.Response) -> None:
    """
    totalAttendedClients is a non-negative integer.
    """

    assert response.json()["totalAttendedClients"] >= 0
