"""
Tests for POST /api/barbershops/{id}/reviews
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.auth import RegisterRequest
from domain.dtos.barbershops import (
    BarbershopReviewResponse,
    CreateBarbershopEmployeeRequest,
    CreateBarbershopReviewRequest,
    UpdateBarbershopStatusRequest,
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


@pytest.fixture(scope="module")
def response(client: ApiClient, barbershop_id: int) -> requests.Response:
    register_request = RegisterRequest.random()
    register_response = client.auth.register(register_request)
    user_id = register_response.json()["id"]

    review_request = CreateBarbershopReviewRequest.random(client_id=user_id)
    return client.barbershops.add_review(barbershop_id, review_request)


@pytest.fixture(scope="module")
def employee_id(client: ApiClient, barbershop_id: int) -> int:
    status_request = UpdateBarbershopStatusRequest(is_active=True)
    client.barbershops.update_status(barbershop_id, status_request)

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

    assert_body_shape(response, BarbershopReviewResponse)


def test_non_client_cannot_review(
    client: ApiClient, barbershop_id: int, employee_id: int
) -> None:
    """
    Non-client users cannot leave reviews. Returns 403.
    """

    request = CreateBarbershopReviewRequest.random(client_id=employee_id)
    response = client.barbershops.add_review(barbershop_id, request)

    assert_status(response, HttpStatus.FORBIDDEN)
    assert_body(response, _ONLY_CLIENTS_CAN_REVIEW)


def test_status_on_unknown_user(client: ApiClient, barbershop_id: int) -> None:
    """
    Unknown user returns 404.
    """

    request = CreateBarbershopReviewRequest.random(client_id=999_999)
    response = client.barbershops.add_review(barbershop_id, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, USER_NOT_FOUND)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    request = CreateBarbershopReviewRequest.random()
    response = client.barbershops.add_review(999_999, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
