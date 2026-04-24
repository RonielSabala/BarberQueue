"""
Tests for POST /api/barbershops/{id}/photos
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos.barbershops import (
    BarbershopPhotoResponse,
    CreateBarbershopPhotosRequest,
)
from helpers.assertions import (
    assert_body,
    assert_content_type,
    assert_list_body_shape,
    assert_status,
)
from helpers.common_responses import BARBERSHOP_NOT_FOUND


@pytest.fixture(scope="module")
def response(client: ApiClient, open_barbershop_id: int) -> requests.Response:
    return client.barbershops.add_photos(
        open_barbershop_id, CreateBarbershopPhotosRequest.random()
    )


def test_status(response: requests.Response) -> None:
    """
    Successful photo upload returns 201.
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

    assert_list_body_shape(response, BarbershopPhotoResponse)


def test_uploaded_count_matches_input(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Number of uploaded photos matches the number sent.
    """

    request = CreateBarbershopPhotosRequest.random()
    response = client.barbershops.add_photos(open_barbershop_id, request)
    photos = tuple(BarbershopPhotoResponse.from_array_response(response))
    assert len(photos) == len(request.photos)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    request = CreateBarbershopPhotosRequest.random()
    response = client.barbershops.add_photos(NON_EXISTENT_ID, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
