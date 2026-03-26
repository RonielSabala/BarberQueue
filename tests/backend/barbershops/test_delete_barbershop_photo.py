import pytest

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos.barbershops import (
    CreateBarbershopPhotosRequest,
    CreateBarbershopRequest,
)
from domain.value_objects.photo_url import PhotoUrl
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import PHOTO_NOT_FOUND


@pytest.fixture(scope="module")
def photo_context(client: ApiClient):
    barbershop_request = CreateBarbershopRequest.random()
    photos_request = CreateBarbershopPhotosRequest(photo_urls=[PhotoUrl.random()])

    barbershop_response = client.barbershops.create(barbershop_request)

    barbershop_id = barbershop_response.json()["id"]
    photos_response = client.barbershops.add_photos(barbershop_id, photos_request)

    photo_id = photos_response.json()["uploaded"][0]["id"]
    return {"shop_id": barbershop_id, "photo_id": photo_id}


def test_status(client: ApiClient, photo_context: dict) -> None:
    """
    Successful photo deletion returns 204.
    """

    response = client.barbershops.delete_photo(
        photo_context["shop_id"], photo_context["photo_id"]
    )
    assert_status(response, HttpStatus.NO_CONTENT)


def test_status_on_unknown_photo(client: ApiClient, photo_context: dict) -> None:
    """
    Deleting unknown photo ID returns 404.
    """

    response = client.barbershops.delete_photo(photo_context["shop_id"], 9999)
    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, PHOTO_NOT_FOUND)
