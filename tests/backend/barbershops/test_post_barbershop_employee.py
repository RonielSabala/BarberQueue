import pytest
import requests

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos.barbershops import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopEmployeeResponse,
    CreateBarbershopRequest,
)
from helpers.assertions import assert_body, assert_body_shape, assert_status
from helpers.common_responses import EMAIL_ALREADY_IN_USE


@pytest.fixture(scope="module")
def shop_id(client: ApiClient) -> int:
    return client.barbershops.create(CreateBarbershopRequest.random()).json()["id"]


@pytest.fixture(scope="module")
def response(client: ApiClient, shop_id: int) -> requests.Response:
    request = CreateBarbershopEmployeeRequest.random()
    return client.barbershops.create_employee(shop_id, request)


def test_status(response: requests.Response) -> None:
    """
    Successful employee creation returns 201.
    """

    assert_status(response, HttpStatus.CREATED)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(response, CreateBarbershopEmployeeResponse)


def test_duplicate_email(client: ApiClient, shop_id: int) -> None:
    """
    Registering an employee with an existing email returns 409.
    """

    request = CreateBarbershopEmployeeRequest.random()
    client.barbershops.create_employee(shop_id, request)
    response = client.barbershops.create_employee(shop_id, request)

    assert_status(response, HttpStatus.CONFLICT)
    assert_body(response, EMAIL_ALREADY_IN_USE)
