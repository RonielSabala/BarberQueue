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
    shop_id = client.barbershops.create(CreateBarbershopRequest.random()).json()["id"]
    photo_res = client.barbershops.add_photos(
        shop_id, CreateBarbershopPhotosRequest(photo_urls=[PhotoUrl.random()])
    )
    photo_id = photo_res.json()["photos"][0]["id"]
    return {"shop_id": shop_id, "photo_id": photo_id}


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
