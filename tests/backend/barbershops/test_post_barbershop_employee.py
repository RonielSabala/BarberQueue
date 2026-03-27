import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.barbershops import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopEmployeeResponse,
)
from domain.value_objects import Role
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import BARBERSHOP_NOT_FOUND, EMAIL_ALREADY_IN_USE

_ONLY_BARBERS_AND_ASSISTANTS_ASSIGNMENTS = ErrorResponse(
    error="Only barbers and assistants can be assigned to a barbershop"
)


@pytest.fixture(scope="module")
def response(
    client: ApiClient,
    barbershop_id: int,
    employee_request: CreateBarbershopEmployeeRequest,
) -> requests.Response:
    return client.barbershops.create_employee(barbershop_id, employee_request)


def test_status(response: requests.Response) -> None:
    """
    Successful employee creation returns 201.
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

    assert_body_shape(response, CreateBarbershopEmployeeResponse)


def test_email_matches_input(
    response: requests.Response, employee_request: CreateBarbershopEmployeeRequest
) -> None:
    """
    Response email matches the submitted email.
    """

    assert response.json()["email"] == employee_request.email.value


def test_role_matches_input(
    response: requests.Response, employee_request: CreateBarbershopEmployeeRequest
) -> None:
    """
    Response role matches the submitted role.
    """

    assert response.json()["role"] == employee_request.role.value


def test_status_on_unknown_barbershop(
    client: ApiClient, employee_request: CreateBarbershopEmployeeRequest
) -> None:
    """
    Unknown barbershop returns 404.
    """

    response = client.barbershops.create_employee(999_999, employee_request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)


def test_duplicate_email(
    client: ApiClient,
    barbershop_id: int,
    employee_request: CreateBarbershopEmployeeRequest,
) -> None:
    """
    Creating an employee with a duplicate email returns 409.
    """

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
    assert_body(response, _ONLY_BARBERS_AND_ASSISTANTS_ASSIGNMENTS)
