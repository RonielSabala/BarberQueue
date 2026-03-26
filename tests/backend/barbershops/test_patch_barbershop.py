import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos import MessageResponse
from domain.dtos.barbershops import CreateBarbershopRequest, UpdateBarbershopRequest
from helpers.assertions import assert_body, assert_content_type, assert_status

BARBERSHOP_UPDATED = MessageResponse(message="Barbershop updated")


@pytest.fixture(scope="module")
def barbershop_id(client: ApiClient) -> int:
    request = CreateBarbershopRequest.random()
    response = client.barbershops.create(request)
    return response.json()["id"]


@pytest.fixture(scope="module")
def response(client: ApiClient, barbershop_id: int) -> requests.Response:
    request = UpdateBarbershopRequest.random()
    return client.barbershops.update(barbershop_id, request)


def test_status(response: requests.Response) -> None:
    """
    Successful barbershop update returns 200.
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

    assert_body(response, BARBERSHOP_UPDATED)
