import pytest

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos.barbershops import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopRequest,
)
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import ASSIGNMENT_NOT_FOUND


@pytest.fixture(scope="module")
def emp_context(client: ApiClient):
    shop_id = client.barbershops.create(CreateBarbershopRequest.random()).json()["id"]
    emp_res = client.barbershops.create_employee(
        shop_id, CreateBarbershopEmployeeRequest.random()
    )
    return {"shop_id": shop_id, "emp_id": emp_res.json()["id"]}


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
