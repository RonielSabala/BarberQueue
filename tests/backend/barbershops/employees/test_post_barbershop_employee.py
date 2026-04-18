import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import ErrorResponse
from domain.dtos.barbershops import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopEmployeeResponse,
)
from domain.enums import RoleEnum
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import BARBERSHOP_NOT_FOUND, EMAIL_ALREADY_IN_USE

_ONLY_BARBERS_AND_ASSISTANTS_ASSIGNMENTS = ErrorResponse(
    error="EmployeeRole must be one of: 'barber', 'assistant'"
)


@pytest.fixture(scope="module")
def response(client: ApiClient, open_barbershop_id: int) -> requests.Response:
    request = CreateBarbershopEmployeeRequest.random()
    return client.barbershops.create_employee(open_barbershop_id, request)


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


def test_email_matches_input(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Response email matches the submitted email.
    """

    request = CreateBarbershopEmployeeRequest.random()
    response = client.barbershops.create_employee(open_barbershop_id, request)
    assert response.json()["email"] == request.email.value


def test_role_matches_input(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Response role matches the submitted role.
    """

    request = CreateBarbershopEmployeeRequest.random()
    response = client.barbershops.create_employee(open_barbershop_id, request)
    assert response.json()["role"] == request.role.value


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    request = CreateBarbershopEmployeeRequest.random()
    response = client.barbershops.create_employee(NON_EXISTENT_ID, request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)


def test_duplicate_email(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Creating an employee with a duplicate email returns 409.
    """

    request = CreateBarbershopEmployeeRequest.random()
    client.barbershops.create_employee(open_barbershop_id, request)
    response = client.barbershops.create_employee(open_barbershop_id, request)

    assert_status(response, HttpStatus.CONFLICT)
    assert_body(response, EMAIL_ALREADY_IN_USE)


def test_incorrect_employee_role(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Registering an employee as a client or admin returns 422.
    """

    request = CreateBarbershopEmployeeRequest.random(
        role=(RoleEnum.CLIENT, RoleEnum.ADMIN)
    )
    response = client.barbershops.create_employee(open_barbershop_id, request)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _ONLY_BARBERS_AND_ASSISTANTS_ASSIGNMENTS)
