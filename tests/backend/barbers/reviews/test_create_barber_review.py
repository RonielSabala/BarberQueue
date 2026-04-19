"""
Tests for POST /api/barbers/{id}/reviews
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import (
    NON_EXISTENT_ID,
    get_employee_id,
    get_fresh_barber_id,
    get_fresh_client_id,
)
from domain.dtos import ErrorResponse
from domain.dtos.barbers import BarberReviewResponse, CreateBarberReviewRequest
from domain.value_objects.rating import Rating
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import BARBER_NOT_FOUND, USER_NOT_FOUND

_TEST_RATING = Rating.random_value()
_ONLY_CLIENTS_CAN_REVIEW = ErrorResponse(error="Only clients can leave barber reviews")


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    client_id = get_fresh_client_id(client)
    barber_id = get_fresh_barber_id(client)
    return client.barbers.create_review(
        barber_id,
        CreateBarberReviewRequest.random(
            client_id=client_id, rating=Rating(_TEST_RATING)
        ),
    )


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

    review = BarberReviewResponse.from_response(response)
    assert review.rating == _TEST_RATING


def test_non_client_cannot_review(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Non-client users cannot leave reviews. Returns 403.
    """

    barber_id = get_fresh_barber_id(client)
    non_client_id = get_employee_id(client, open_barbershop_id)

    request = CreateBarberReviewRequest.random(client_id=non_client_id)
    response = client.barbers.create_review(barber_id, request)

    assert_status(response, HttpStatus.FORBIDDEN)
    assert_body(response, _ONLY_CLIENTS_CAN_REVIEW)


def test_status_on_unknown_user(client: ApiClient) -> None:
    """
    Unknown user returns 404.
    """

    barber_id = get_fresh_barber_id(client)

    request = CreateBarberReviewRequest.random(client_id=NON_EXISTENT_ID)
    response = client.barbers.create_review(barber_id, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, USER_NOT_FOUND)


def test_status_on_unknown_barber(client: ApiClient) -> None:
    """
    Unknown barber returns 404.
    """

    client_id = get_fresh_client_id(client)
    request = CreateBarberReviewRequest.random(client_id=client_id)
    response = client.barbers.create_review(NON_EXISTENT_ID, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)
