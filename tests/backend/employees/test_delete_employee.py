"""
Tests for DELETE /api/employees/{id}
"""

from api.client import ApiClient
from api.core import HttpStatus
from backend.conftest import NON_EXISTENT_ID, get_fresh_employee_id
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import EMPLOYEE_NOT_FOUND


def test_status(client: ApiClient) -> None:
    """
    Successful employee deletion returns 204.
    """

    employee_id = get_fresh_employee_id(client)
    response = client.employees.delete(employee_id)
    assert_status(response, HttpStatus.NO_CONTENT)


def test_status_on_unknown_employee(client: ApiClient) -> None:
    """
    Unknown employee returns 404.
    """

    response = client.employees.delete(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, EMPLOYEE_NOT_FOUND)


def test_employee_no_longer_accessible(client: ApiClient) -> None:
    """
    Deleted employee returns 404 on GET.
    """

    employee_id = get_fresh_employee_id(client)
    client.employees.delete(employee_id)
    response = client.employees.get(employee_id)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, EMPLOYEE_NOT_FOUND)
