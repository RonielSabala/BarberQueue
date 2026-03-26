import pytest
import requests

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos.barbershops import (
    BarbershopResponse,
    CreateBarbershopRequest,
    UpdateBarbershopStatusRequest,
)
from helpers.assertions import assert_body_shape, assert_status


@pytest.fixture(scope="module")
def barbershop_id(client: ApiClient) -> int:
    return client.barbershops.create(CreateBarbershopRequest.random()).json()["id"]


@pytest.fixture(scope="module")
def response(client: ApiClient, barbershop_id: int) -> requests.Response:
    request = UpdateBarbershopStatusRequest(is_active=False)
    return client.barbershops.update_status(barbershop_id, request)


def test_status(response: requests.Response) -> None:
    """
    Successful status update returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(response, BarbershopResponse)
