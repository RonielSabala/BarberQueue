"""
Tests for GET /api/barbers/{id}/reviews
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID, get_fresh_barber_id, get_fresh_client_id
from domain.dtos.barbers import BarberReviewResponse, CreateBarberReviewRequest
from helpers.assertions import (
    assert_body,
    assert_content_type,
    assert_list_body_shape,
    assert_status,
)
from helpers.common_responses import BARBER_NOT_FOUND


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    client_id = get_fresh_client_id(client)
    barber_id = get_fresh_barber_id(client)
    client.barbers.create_review(
        barber_id, CreateBarberReviewRequest.random(client_id=client_id)
    )

    return client.barbers.get_reviews(barber_id)


def test_status(response: requests.Response) -> None:
    """
    Successful reviews list returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(response: requests.Response) -> None:
    """
    Response body is a list.
    """

    assert_list_body_shape(response, BarberReviewResponse)


def test_status_on_unknown_barber(client: ApiClient) -> None:
    """
    Unknown barber returns 404.
    """

    response = client.barbers.get_reviews(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)
