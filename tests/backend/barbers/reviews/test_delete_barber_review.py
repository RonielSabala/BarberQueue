"""
Tests for DELETE /api/barbers/{id}/reviews/{reviewId}
"""

import pytest

from api.client import ApiClient
from api.core import HttpStatus
from backend.conftest import NON_EXISTENT_ID, get_fresh_barber_id, get_fresh_client_id
from domain.dtos import ErrorResponse
from domain.dtos.barbers import CreateBarberReviewRequest
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import BARBER_NOT_FOUND

_REVIEW_NOT_FOUND = ErrorResponse(error="Barber review not found")


@pytest.fixture(scope="module")
def barber_id(client: ApiClient) -> int:
    return get_fresh_barber_id(client)


@pytest.fixture(scope="module")
def review_id(client: ApiClient, barber_id: int) -> int:
    client_id = get_fresh_client_id(client)
    request = CreateBarberReviewRequest.random(client_id=client_id)
    response = client.barbers.create_review(barber_id, request)
    return response.json()["id"]


def test_status(client: ApiClient, barber_id: int, review_id: int) -> None:
    """
    Successful review deletion returns 204.
    """

    response = client.barbers.delete_review(barber_id, review_id)
    assert_status(response, HttpStatus.NO_CONTENT)


def test_status_on_unknown_review(client: ApiClient, barber_id: int) -> None:
    """
    Unknown review returns 404.
    """

    response = client.barbers.delete_review(barber_id, NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _REVIEW_NOT_FOUND)


def test_status_on_unknown_barber(client: ApiClient) -> None:
    """
    Unknown barber returns 404.
    """

    response = client.barbers.delete_review(NON_EXISTENT_ID, NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)


def test_review_no_longer_in_list(
    client: ApiClient, barber_id: int, review_id: int
) -> None:
    """
    Deleted review no longer appears.
    """

    client.barbers.delete_review(barber_id, review_id)
    response = client.barbers.get_reviews(barber_id)
    assert all(review_id != review["id"] for review in response.json())
