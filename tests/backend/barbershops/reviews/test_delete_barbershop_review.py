"""
Tests for DELETE /api/barbershops/{id}/reviews/{reviewId}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import ErrorResponse
from domain.dtos.barbershops import BarbershopReviewResponse
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import BARBERSHOP_NOT_FOUND

_REVIEW_NOT_FOUND = ErrorResponse(error="Barbershop review not found")


@pytest.fixture(scope="module")
def review_id(create_review_response: requests.Response) -> int:
    review = BarbershopReviewResponse.from_response(create_review_response)
    return review._id


def test_status(client: ApiClient, open_barbershop_id: int, review_id: int) -> None:
    """
    Successful review deletion returns 204.
    """

    response = client.barbershops.delete_review(open_barbershop_id, review_id)
    assert_status(response, HttpStatus.NO_CONTENT)


def test_status_on_unknown_review(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Deleting unknown review returns 404.
    """

    response = client.barbershops.delete_review(open_barbershop_id, NON_EXISTENT_ID)
    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _REVIEW_NOT_FOUND)


def test_status_on_unknown_barbershop(client: ApiClient, review_id: int) -> None:
    """
    Unknown barbershop returns 404.
    """

    response = client.barbershops.delete_review(NON_EXISTENT_ID, review_id)
    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
