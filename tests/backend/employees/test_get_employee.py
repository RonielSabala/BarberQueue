"""
Tests for GET /api/employees/{id}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos.auth import RegisterRequest
from domain.dtos.barbershops import CreateBarbershopEmployeeRequest
from domain.dtos.employees import EmployeeResponse
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import EMPLOYEE_NOT_FOUND


@pytest.fixture(scope="module")
def employee_id(client: ApiClient, barbershop_id: int) -> int:
    employee_request = CreateBarbershopEmployeeRequest.random_employee()
    response = client.barbershops.create_employee(barbershop_id, employee_request)
    return response.json()["id"]


@pytest.fixture(scope="module")
def response(client: ApiClient, employee_id: int) -> requests.Response:
    return client.employees.get(employee_id)


def test_status(response: requests.Response) -> None:
    """
    Successful employee profile returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(response, EmployeeResponse)


def test_status_on_unknown_employee(client: ApiClient) -> None:
    """
    Unknown employee returns 404.
    """

    response = client.employees.get(999_999)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, EMPLOYEE_NOT_FOUND)


def test_status_on_client_user(client: ApiClient) -> None:
    """
    Requesting a client user as employee returns 422.
    """

    register_request = RegisterRequest.random()
    register_response = client.auth.register(register_request)

    client_id = register_response.json()["id"]
    response = client.employees.get(client_id)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
