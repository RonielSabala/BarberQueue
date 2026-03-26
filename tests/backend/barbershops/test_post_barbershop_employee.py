import pytest
import requests

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.barbershops import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopEmployeeResponse,
    CreateBarbershopRequest,
)
from domain.value_objects import Role
from helpers.assertions import assert_body, assert_body_shape, assert_status
from helpers.common_responses import EMAIL_ALREADY_IN_USE

ONLY_BARBERS_AND_ASSISTANTS_ASSIGNMENTS = ErrorResponse(
    error="Only barbers and assistants can be assigned to a barbershop"
)


@pytest.fixture(scope="module")
def barbershop_id(client: ApiClient) -> int:
    request = CreateBarbershopRequest.random()
    response = client.barbershops.create(request)
    return response.json()["id"]


@pytest.fixture(scope="module")
def employee_request() -> CreateBarbershopEmployeeRequest:
    return CreateBarbershopEmployeeRequest.random(role=(Role.BARBER, Role.ASSISTANT))


@pytest.fixture(scope="module")
def response(
    client: ApiClient,
    employee_request: CreateBarbershopEmployeeRequest,
    barbershop_id: int,
) -> requests.Response:
    return client.barbershops.create_employee(barbershop_id, employee_request)


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


def test_duplicate_email(
    client: ApiClient,
    employee_request: CreateBarbershopEmployeeRequest,
    barbershop_id: int,
) -> None:
    """
    Registering an employee with an existing email returns 409.
    """

    client.barbershops.create_employee(barbershop_id, employee_request)
    response = client.barbershops.create_employee(barbershop_id, employee_request)

    assert_status(response, HttpStatus.CONFLICT)
    assert_body(response, EMAIL_ALREADY_IN_USE)


def test_incorrect_employee_role(client: ApiClient, barbershop_id: int) -> None:
    """
    Registering an employee as a client or admin returns 422.
    """

    employee_request = CreateBarbershopEmployeeRequest.random(
        role=(Role.CLIENT, Role.ADMIN)
    )
    response = client.barbershops.create_employee(barbershop_id, employee_request)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, ONLY_BARBERS_AND_ASSISTANTS_ASSIGNMENTS)
