"""
Tests for DELETE /api/barbershops/{id}/reviews/{reviewId}
"""

import pytest

from api.client import ApiClient
from api.core import HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import ErrorResponse
from domain.dtos.auth import RegisterRequest
from domain.dtos.barbershops import CreateBarbershopReviewRequest
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import BARBERSHOP_NOT_FOUND

_REVIEW_NOT_FOUND = ErrorResponse(error="Barbershop review not found")


@pytest.fixture
def review_id(client: ApiClient, barbershop_id: int) -> int:
    register_request = RegisterRequest.random()
    register_response = client.auth.register(register_request)
    user_id = register_response.json()["id"]

    review_request = CreateBarbershopReviewRequest.random(client_id=user_id)
    response = client.barbershops.add_review(barbershop_id, review_request)
    return response.json()["id"]


def test_status(client: ApiClient, barbershop_id: int, review_id: int) -> None:
    """
    Successful review deletion returns 204.
    """

    response = client.barbershops.delete_review(barbershop_id, review_id)
    assert_status(response, HttpStatus.NO_CONTENT)


def test_status_on_unknown_review(client: ApiClient, barbershop_id: int) -> None:
    """
    Deleting unknown review returns 404.
    """

    response = client.barbershops.delete_review(barbershop_id, NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _REVIEW_NOT_FOUND)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    response = client.barbershops.delete_review(NON_EXISTENT_ID, NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
