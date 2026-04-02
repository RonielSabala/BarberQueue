"""
Tests for DELETE /api/barbershops/{id}/photos/{photoId}
"""

import pytest

from api.client import ApiClient
from api.core import HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import ErrorResponse
from domain.dtos.barbershops import CreateBarbershopPhotosRequest
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import BARBERSHOP_NOT_FOUND

_PHOTO_NOT_FOUND = ErrorResponse(error="Barbershop photo not found")


@pytest.fixture
def photo_id(client: ApiClient, barbershop_id: int) -> int:
    response = client.barbershops.add_photos(
        barbershop_id, CreateBarbershopPhotosRequest.random()
    )
    return response.json()["uploaded"][0]["id"]


def test_status(client: ApiClient, barbershop_id: int, photo_id: int) -> None:
    """
    Successful photo deletion returns 204.
    """

    response = client.barbershops.delete_photo(barbershop_id, photo_id)
    assert_status(response, HttpStatus.NO_CONTENT)


def test_status_on_unknown_photo(client: ApiClient, barbershop_id: int) -> None:
    """
    Deleting unknown photo ID returns 404.
    """

    response = client.barbershops.delete_photo(barbershop_id, NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _PHOTO_NOT_FOUND)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    response = client.barbershops.delete_photo(NON_EXISTENT_ID, NON_EXISTENT_ID)

    assert_body(response, BARBERSHOP_NOT_FOUND)
    assert_status(response, HttpStatus.NOT_FOUND)
