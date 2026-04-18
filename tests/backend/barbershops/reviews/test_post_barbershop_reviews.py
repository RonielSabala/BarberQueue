"""
Tests for POST /api/barbershops/{id}/reviews
"""

import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID, get_employee_id
from domain.dtos import ErrorResponse
from domain.dtos.barbershops import (
    BarbershopReviewResponse,
    CreateBarbershopReviewRequest,
)
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import BARBERSHOP_NOT_FOUND, USER_NOT_FOUND

_ONLY_CLIENTS_CAN_REVIEW = ErrorResponse(
    error="Only clients can leave barbershop reviews"
)


def test_status(create_review_response: requests.Response) -> None:
    """
    Successful review creation returns 201.
    """

    assert_status(create_review_response, HttpStatus.CREATED)


def test_content_type(create_review_response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(create_review_response, HttpHeader.JSON)


def test_body_shape(create_review_response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(create_review_response, BarbershopReviewResponse)


def test_non_client_cannot_review(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Non-client users cannot leave reviews. Returns 403.
    """

    employee_id = get_employee_id(client, open_barbershop_id)
    request = CreateBarbershopReviewRequest.random(client_id=employee_id)
    response = client.barbershops.add_review(open_barbershop_id, request)

    assert_status(response, HttpStatus.FORBIDDEN)
    assert_body(response, _ONLY_CLIENTS_CAN_REVIEW)


def test_status_on_unknown_user(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Unknown user returns 404.
    """

    request = CreateBarbershopReviewRequest.random(client_id=NON_EXISTENT_ID)
    response = client.barbershops.add_review(open_barbershop_id, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, USER_NOT_FOUND)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    request = CreateBarbershopReviewRequest.random()
    response = client.barbershops.add_review(NON_EXISTENT_ID, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
