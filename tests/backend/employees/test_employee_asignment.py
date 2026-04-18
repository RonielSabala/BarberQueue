"""
Tests for PATCH /api/employees/{id}/barbershop/{barbershopId}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import (
    NON_EXISTENT_ID,
    get_employee_id,
    get_open_barbershop_id,
    get_random_working_days_pair,
)
from domain.dtos import MessageResponse
from domain.dtos.employees import UpdateEmployeeAssignmentRequest
from domain.value_objects import TimeOfDay
from helpers.assertions import assert_body, assert_content_type, assert_status
from helpers.common_responses import (
    ASSIGNMENT_NOT_FOUND,
    AT_LEAST_ONE_FIELD,
    BARBERSHOP_NOT_FOUND,
    EMPLOYEE_NOT_FOUND,
)

_SCHEDULE_UPDATED = MessageResponse(message="Employee updated")


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    start_time, end_time = TimeOfDay.random_sorted_times(n=2)
    first_days, second_days = get_random_working_days_pair()

    barbershop_id = get_open_barbershop_id(client)
    employee_id = get_employee_id(client, barbershop_id, working_days=first_days)

    update_assignment_request = UpdateEmployeeAssignmentRequest.random(
        start_time=start_time, end_time=end_time, working_days=second_days
    )

    return client.employees.update_assignment(
        employee_id, barbershop_id, update_assignment_request
    )


def test_status(response: requests.Response) -> None:
    """
    Successful schedule update returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body(response: requests.Response) -> None:
    """
    Response contains a confirmation message.
    """

    assert_body(response, _SCHEDULE_UPDATED)


def test_fields_persists(client: ApiClient) -> None:
    """
    Updated fields are reflected in GET.
    """

    start_time, end_time = TimeOfDay.random_sorted_times(n=2)
    first_days, second_days = get_random_working_days_pair()

    barbershop_id = get_open_barbershop_id(client)
    employee_id = get_employee_id(client, barbershop_id, working_days=first_days)

    update_assignment_request = UpdateEmployeeAssignmentRequest.random(
        start_time=start_time, end_time=end_time, working_days=second_days
    )

    client.employees.update_assignment(
        employee_id, barbershop_id, update_assignment_request
    )

    response = client.employees.get(employee_id)
    assignments = response.json()["assignments"]
    matching = next(
        (
            assignment
            for assignment in assignments
            if assignment["barbershopId"] == barbershop_id
        ),
        None,
    )

    assert matching is not None
    assert matching["startTime"] == start_time.value
    assert matching["endTime"] == end_time.value
    assert matching["workingDays"] == [day.value for day in second_days]


def test_no_fields(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Sending no fields returns 400.
    """

    employee_id = get_employee_id(client, open_barbershop_id)
    response = client.employees.update_assignment(
        employee_id,
        open_barbershop_id,
        UpdateEmployeeAssignmentRequest.random(optional_chance=0),
    )

    assert_status(response, HttpStatus.BAD_REQUEST)
    assert_body(response, AT_LEAST_ONE_FIELD)


def test_status_on_unknown_employee(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Unknown employee returns 404.
    """

    response = client.employees.update_assignment(
        NON_EXISTENT_ID, open_barbershop_id, UpdateEmployeeAssignmentRequest.random()
    )

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, EMPLOYEE_NOT_FOUND)


def test_status_on_unknown_barbershop(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Unknown barbershop returns 404.
    """

    employee_id = get_employee_id(client, open_barbershop_id)
    response = client.employees.update_assignment(
        employee_id, NON_EXISTENT_ID, UpdateEmployeeAssignmentRequest.random()
    )

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)


def test_status_on_unknown_assignment(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Valid employee and barbershop but no assignment between them returns 404.
    """

    employee_id = get_employee_id(client, open_barbershop_id)
    other_barbershop_id = get_open_barbershop_id(client)

    # Try to update assignment at the unrelated barbershop
    assignment_response = client.employees.update_assignment(
        employee_id, other_barbershop_id, UpdateEmployeeAssignmentRequest.random()
    )

    assert_status(assignment_response, HttpStatus.NOT_FOUND)
    assert_body(assignment_response, ASSIGNMENT_NOT_FOUND)
