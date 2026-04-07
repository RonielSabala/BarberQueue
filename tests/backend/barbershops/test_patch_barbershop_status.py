"""
Tests for PATCH /api/barbershops/{id}/status
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import MessageResponse
from domain.dtos.barbershops import UpdateBarbershopStatusRequest
from domain.utils import random_bool
from helpers.assertions import assert_body, assert_content_type, assert_status
from helpers.common_responses import BARBERSHOP_NOT_FOUND

_STATUS_UPDATED = MessageResponse(message="Barbershop status updated")


@pytest.fixture(scope="module")
def response(client: ApiClient, barbershop_id: int) -> requests.Response:
    request = UpdateBarbershopStatusRequest(is_active=False)
    return client.barbershops.update_status(barbershop_id, request)


def test_status(response: requests.Response) -> None:
    """
    Successful status update returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body(response: requests.Response) -> None:
    """
    Response contains a confirmation message.
    """

    assert_body(response, _STATUS_UPDATED)


def test_status_reflects_change(client: ApiClient, barbershop_id: int) -> None:
    """
    Updated isActive is reflected.
    """

    status_value = random_bool()
    Update_request = UpdateBarbershopStatusRequest(is_active=status_value)
    client.barbershops.update_status(barbershop_id, Update_request)

    response = client.barbershops.get(barbershop_id)
    assert response.json()["isActive"] is status_value


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    request = UpdateBarbershopStatusRequest(is_active=False)
    response = client.barbershops.update_status(NON_EXISTENT_ID, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
