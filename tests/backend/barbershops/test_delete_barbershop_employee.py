"""
Tests for DELETE /api/barbershops/{id}/employees/{employeeId}
"""

import pytest

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos import ErrorResponse
from domain.dtos.barbershops import CreateBarbershopEmployeeRequest
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import BARBERSHOP_NOT_FOUND

_ASSIGNMENT_NOT_FOUND = ErrorResponse(error="Assignment not found")


@pytest.fixture
def employee_id(
    client: ApiClient,
    barbershop_id: int,
    employee_request: CreateBarbershopEmployeeRequest,
) -> int:
    response = client.barbershops.create_employee(barbershop_id, employee_request)
    return response.json()["id"]


def test_status(client: ApiClient, barbershop_id: int, employee_id: int) -> None:
    """
    Successful assignment deletion returns 204.
    """

    response = client.barbershops.delete_employee_assignment(barbershop_id, employee_id)
    assert_status(response, HttpStatus.NO_CONTENT)


def test_status_on_unknown_assignment(client: ApiClient, barbershop_id: int) -> None:
    """
    Removing non-existent assignment returns 404.
    """

    response = client.barbershops.delete_employee_assignment(barbershop_id, 999_999)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _ASSIGNMENT_NOT_FOUND)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    response = client.barbershops.delete_employee_assignment(999_999, 999_999)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)


def test_employee_no_longer_in_list(
    client: ApiClient, barbershop_id: int, employee_id: int
) -> None:
    """
    Deleted assignment no longer appears in the employees list.
    """

    client.barbershops.delete_employee_assignment(barbershop_id, employee_id)
    response = client.barbershops.get_employees(barbershop_id)

    assert all(employee_id != employee["id"] for employee in response.json())
