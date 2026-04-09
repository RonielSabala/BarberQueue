"""
Tests for PATCH /api/barbershops/{id}/photo
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import MessageResponse
from domain.dtos.barbershops import UpdateBarbershopPhotoRequest
from helpers.assertions import assert_body, assert_content_type, assert_status
from helpers.common_responses import BARBERSHOP_NOT_FOUND

_PHOTO_UPDATED = MessageResponse(message="Barbershop photo updated")


@pytest.fixture(scope="module")
def response(client: ApiClient, barbershop_id: int) -> requests.Response:
    request = UpdateBarbershopPhotoRequest.random()
    return client.barbershops.update_photo(barbershop_id, request)


def test_status(response: requests.Response) -> None:
    """
    Successful photo update returns 200.
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

    assert_body(response, _PHOTO_UPDATED)


def test_photo_persists(client: ApiClient, barbershop_id: int) -> None:
    """
    Updated photo URL is reflected.
    """

    update_request = UpdateBarbershopPhotoRequest.random()
    client.barbershops.update_photo(barbershop_id, update_request)

    response = client.barbershops.get(barbershop_id)
    assert response.json()["photoUrl"] == update_request.photo_url.value


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    request = UpdateBarbershopPhotoRequest.random()
    response = client.barbershops.update_photo(NON_EXISTENT_ID, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
