"""
Tests for GET /api/barbershops/{id}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos.barbershops import BarbershopDetailResponse
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import BARBERSHOP_NOT_FOUND


@pytest.fixture(scope="module")
def response(client: ApiClient, open_barbershop_id: int) -> requests.Response:
    return client.barbershops.get(open_barbershop_id)


def test_status(response: requests.Response) -> None:
    """
    Successful barbershop retrieval returns 200.
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

    assert_body_shape(response, BarbershopDetailResponse)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    response = client.barbershops.get(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
