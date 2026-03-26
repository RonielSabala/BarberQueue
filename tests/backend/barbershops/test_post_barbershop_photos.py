import pytest
import requests

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos.barbershops import (
    CreateBarbershopPhotosRequest,
    CreateBarbershopPhotosResponse,
    CreateBarbershopRequest,
)
from domain.value_objects.photo_url import PhotoUrl
from helpers.assertions import assert_body_shape, assert_status


@pytest.fixture(scope="module")
def barbershop_id(client: ApiClient) -> int:
    return client.barbershops.create(CreateBarbershopRequest.random()).json()["id"]


@pytest.fixture(scope="module")
def response(client: ApiClient, barbershop_id: int) -> requests.Response:
    request = CreateBarbershopPhotosRequest(
        photo_urls=[PhotoUrl.random(), PhotoUrl.random()]
    )

    return client.barbershops.add_photos(barbershop_id, request)


def test_status(response: requests.Response) -> None:
    """
    Successful gallery additions returns 201.
    """

    assert_status(response, HttpStatus.CREATED)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(response, CreateBarbershopPhotosResponse)
