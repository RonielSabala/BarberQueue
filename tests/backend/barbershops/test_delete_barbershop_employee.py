import pytest

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos.barbershops import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopRequest,
)
from domain.value_objects.role_name import Role
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import ASSIGNMENT_NOT_FOUND


@pytest.fixture(scope="module")
def emp_context(client: ApiClient):
    employee_request = CreateBarbershopEmployeeRequest.random(role=Role.BARBER)
    barbershop_request = CreateBarbershopRequest.random()

    barbershop_response = client.barbershops.create(barbershop_request)
    employee_response = client.barbershops.create_employee(
        barbershop_id := barbershop_response.json()["id"], employee_request
    )

    employee_id = employee_response.json()["id"]
    return {"shop_id": barbershop_id, "emp_id": employee_id}


def test_status(client: ApiClient, emp_context: dict) -> None:
    """
    Successful assignment removal returns 204.
    """

    response = client.barbershops.delete_employee(
        emp_context["shop_id"], emp_context["emp_id"]
    )
    assert_status(response, HttpStatus.NO_CONTENT)


def test_status_on_unknown_assignment(client: ApiClient, emp_context: dict) -> None:
    """
    Removing non-existent assignment returns 404.
    """

    response = client.barbershops.delete_employee(emp_context["shop_id"], 9999)
    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, ASSIGNMENT_NOT_FOUND)
