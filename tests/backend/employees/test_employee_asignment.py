"""
Tests for PATCH /api/employees/{id}/barbershop/{barbershopId}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import MessageResponse
from domain.dtos.barbershops import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopRequest,
)
from domain.dtos.employees import UpdateEmployeeAssignmentRequest
from domain.value_objects import DayOfWeek, TimeOfDay
from helpers.assertions import assert_body, assert_content_type, assert_status
from helpers.common_responses import (
    ASSIGNMENT_NOT_FOUND,
    AT_LEAST_ONE_FIELD,
    BARBERSHOP_NOT_FOUND,
    EMPLOYEE_NOT_FOUND,
)

_SCHEDULE_UPDATED = MessageResponse(message="Employee schedule updated")


@pytest.fixture(scope="module")
def assignment(client: ApiClient, barbershop_id: int) -> dict:
    request = CreateBarbershopEmployeeRequest.random_employee()
    response = client.barbershops.create_employee(barbershop_id, request)
    return {"employee_id": response.json()["id"], "barbershop_id": barbershop_id}


@pytest.fixture(scope="module")
def response(client: ApiClient, barbershop_id: int) -> requests.Response:
    employee_request = CreateBarbershopEmployeeRequest.random_employee()
    update_assignment_request = UpdateEmployeeAssignmentRequest.random(
        start_time=TimeOfDay.random()
    )

    response = client.barbershops.create_employee(barbershop_id, employee_request)
    return client.employees.update_assignment(
        response.json()["id"], barbershop_id, update_assignment_request
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


def test_start_time_persists(client: ApiClient, assignment: dict) -> None:
    """
    Updated start time is reflected in GET /api/employees/{id}.
    """

    new_start = TimeOfDay.random()
    client.employees.update_assignment(
        assignment["employee_id"],
        assignment["barbershop_id"],
        UpdateEmployeeAssignmentRequest.random(start_time=new_start),
    )

    response = client.employees.get(assignment["employee_id"])
    assignments = response.json()["assignments"]
    matching = next(
        (a for a in assignments if a["barbershopId"] == assignment["barbershop_id"]),
        None,
    )

    assert matching is not None
    assert matching["startTime"] == new_start.value


def test_working_days_persist(client: ApiClient, assignment: dict) -> None:
    """
    Updated working days are reflected in GET /api/employees/{id}.
    """

    new_days = [DayOfWeek(1), DayOfWeek(2), DayOfWeek(3)]
    assignment_request = UpdateEmployeeAssignmentRequest.random(working_days=new_days)
    client.employees.update_assignment(
        assignment["employee_id"], assignment["barbershop_id"], assignment_request
    )

    response = client.employees.get(assignment["employee_id"])
    assignments = response.json()["assignments"]
    matching = next(
        (a for a in assignments if a["barbershopId"] == assignment["barbershop_id"]),
        None,
    )

    assert matching is not None
    assert matching["workingDays"] == [day.value for day in new_days]


def test_no_fields(client: ApiClient, assignment: dict) -> None:
    """
    Sending no fields returns 400.
    """

    assignment_request = UpdateEmployeeAssignmentRequest.random(optional_chance=0)
    response = client.employees.update_assignment(
        assignment["employee_id"], assignment["barbershop_id"], assignment_request
    )

    assert_status(response, HttpStatus.BAD_REQUEST)
    assert_body(response, AT_LEAST_ONE_FIELD)


def test_status_on_unknown_employee(client: ApiClient, barbershop_id: int) -> None:
    """
    Unknown employee returns 404.
    """

    assignment_request = UpdateEmployeeAssignmentRequest.random()
    response = client.employees.update_assignment(
        NON_EXISTENT_ID, barbershop_id, assignment_request
    )

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, EMPLOYEE_NOT_FOUND)


def test_status_on_unknown_barbershop(client: ApiClient, assignment: dict) -> None:
    """
    Unknown barbershop returns 404.
    """

    assignment_request = UpdateEmployeeAssignmentRequest.random()
    response = client.employees.update_assignment(
        assignment["employee_id"], NON_EXISTENT_ID, assignment_request
    )

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)


def test_status_on_unknown_assignment(
    client: ApiClient, barbershop_id: int, barbershop_request: CreateBarbershopRequest
) -> None:
    """
    Valid employee and barbershop but no assignment between them returns 404.
    """

    # Create employee assigned to barbershop_id
    employee_request = CreateBarbershopEmployeeRequest.random_employee()
    employee_response = client.barbershops.create_employee(
        barbershop_id, employee_request
    )
    employee_id = employee_response.json()["id"]

    # Create a separate barbershop the employee is NOT assigned to
    barbershop_response = client.barbershops.create(barbershop_request)
    other_barbershop_id = barbershop_response.json()["id"]

    # Try to update assignment at the unrelated barbershop
    assignment_request = UpdateEmployeeAssignmentRequest.random()
    assignment_response = client.employees.update_assignment(
        employee_id, other_barbershop_id, assignment_request
    )

    assert_status(assignment_response, HttpStatus.NOT_FOUND)
    assert_body(assignment_response, ASSIGNMENT_NOT_FOUND)
