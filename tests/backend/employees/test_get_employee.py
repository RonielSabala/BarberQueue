"""
Tests for GET /api/employees/{id}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID, get_fresh_client_id, get_fresh_employee_id
from domain.dtos.employees import EmployeeResponse
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import EMPLOYEE_NOT_FOUND


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    employee_id = get_fresh_employee_id(client)
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

    response = client.employees.get(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, EMPLOYEE_NOT_FOUND)


def test_status_on_client_user(client: ApiClient) -> None:
    """
    Requesting a client user as employee returns 422.
    """

    client_id = get_fresh_client_id(client)
    response = client.employees.get(client_id)
    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
