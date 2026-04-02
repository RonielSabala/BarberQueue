"""
Tests for DELETE /api/employees/{id}
"""

import pytest

from api.client import ApiClient
from api.core import HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos.barbershops import CreateBarbershopEmployeeRequest
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import EMPLOYEE_NOT_FOUND


@pytest.fixture
def employee_id(client: ApiClient, barbershop_id: int) -> int:
    request = CreateBarbershopEmployeeRequest.random_employee()
    response = client.barbershops.create_employee(barbershop_id, request)
    return response.json()["id"]


def test_status(client: ApiClient, employee_id: int) -> None:
    """
    Successful employee deletion returns 204.
    """

    response = client.employees.delete(employee_id)
    assert_status(response, HttpStatus.NO_CONTENT)


def test_status_on_unknown_employee(client: ApiClient) -> None:
    """
    Unknown employee returns 404.
    """

    response = client.employees.delete(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, EMPLOYEE_NOT_FOUND)


def test_employee_no_longer_accessible(client: ApiClient, employee_id: int) -> None:
    """
    Deleted employee returns 404 on GET.
    """

    client.employees.delete(employee_id)
    response = client.employees.get(employee_id)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, EMPLOYEE_NOT_FOUND)
