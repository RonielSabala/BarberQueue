"""
Tests for POST /api/barbers/{id}/reviews
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import ErrorResponse
from domain.dtos.barbers import BarberReviewResponse, CreateBarberReviewRequest
from domain.dtos.barbershops import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopRequest,
)
from domain.value_objects.rating import Rating
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import BARBER_NOT_FOUND, USER_NOT_FOUND

_TEST_RATING = 5
_ONLY_CLIENTS_CAN_REVIEW = ErrorResponse(error="Only clients can leave barber reviews")


@pytest.fixture(scope="module")
def response(client: ApiClient, client_id: int, barber_id: int) -> requests.Response:
    request = CreateBarberReviewRequest.random(
        client_id=client_id, rating=Rating(_TEST_RATING)
    )
    return client.barbers.create_review(barber_id, request)


@pytest.fixture(scope="module")
def non_client_id(
    client: ApiClient, barbershop_request: CreateBarbershopRequest
) -> int:
    barbershop_response = client.barbershops.create(barbershop_request)
    barbershop_id = barbershop_response.json()["id"]

    employee_request = CreateBarbershopEmployeeRequest.random_employee()
    employee_response = client.barbershops.create_employee(
        barbershop_id, employee_request
    )

    return employee_response.json()["id"]


def test_status(response: requests.Response) -> None:
    """
    Successful review creation returns 201.
    """

    assert_status(response, HttpStatus.CREATED)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(response, BarberReviewResponse)


def test_rating_matches_input(response: requests.Response) -> None:
    """
    Response rating matches the submitted rating.
    """

    assert response.json()["rating"] == _TEST_RATING


def test_non_client_cannot_review(
    client: ApiClient, barber_id: int, non_client_id: int
) -> None:
    """
    Non-client users cannot leave reviews — returns 403.
    """

    request = CreateBarberReviewRequest.random(client_id=non_client_id)
    response = client.barbers.create_review(barber_id, request)

    assert_status(response, HttpStatus.FORBIDDEN)
    assert_body(response, _ONLY_CLIENTS_CAN_REVIEW)


def test_status_on_unknown_user(client: ApiClient, barber_id: int) -> None:
    """
    Unknown user returns 404.
    """

    request = CreateBarberReviewRequest.random(client_id=NON_EXISTENT_ID)
    response = client.barbers.create_review(barber_id, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, USER_NOT_FOUND)


def test_status_on_unknown_barber(client: ApiClient, client_id: int) -> None:
    """
    Unknown barber returns 404.
    """

    request = CreateBarberReviewRequest.random(client_id=client_id)
    response = client.barbers.create_review(NON_EXISTENT_ID, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)
