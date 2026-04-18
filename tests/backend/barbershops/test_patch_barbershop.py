"""
Tests for PATCH /api/barbershops/{id}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import MessageResponse
from domain.dtos.barbershops import UpdateBarbershopRequest
from domain.value_objects import BarbershopName
from helpers.assertions import assert_body, assert_content_type, assert_status
from helpers.common_responses import AT_LEAST_ONE_FIELD, BARBERSHOP_NOT_FOUND

_BARBERSHOP_UPDATED = MessageResponse(message="Barbershop updated")


@pytest.fixture(scope="module")
def response(client: ApiClient, open_barbershop_id: int) -> requests.Response:
    request = UpdateBarbershopRequest.random(barbershop_name=BarbershopName.random())
    return client.barbershops.update(open_barbershop_id, request)


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


def test_body(response: requests.Response) -> None:
    """
    Response contains a confirmation message.
    """

    assert_body(response, _BARBERSHOP_UPDATED)


def test_name_persists(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Updated name is reflected.
    """

    new_name = BarbershopName.random()
    update_request = UpdateBarbershopRequest.random(barbershop_name=new_name)
    client.barbershops.update(open_barbershop_id, update_request)

    response = client.barbershops.get(open_barbershop_id)
    assert response.json()["barbershopName"] == new_name.value


def test_no_fields(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Sending no fields returns 400.
    """

    request = UpdateBarbershopRequest.random(optional_chance=0)
    response = client.barbershops.update(open_barbershop_id, request)

    assert_status(response, HttpStatus.BAD_REQUEST)
    assert_body(response, AT_LEAST_ONE_FIELD)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    request = UpdateBarbershopRequest.random()
    response = client.barbershops.update(NON_EXISTENT_ID, request)

    assert_body(response, BARBERSHOP_NOT_FOUND)
    assert_status(response, HttpStatus.NOT_FOUND)
