"""
Tests for POST /api/barbershops/{id}/employees/{employeeId}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpStatus
from backend.conftest import (
    NON_EXISTENT_ID,
    get_barbershop_id_from_request,
    get_barbershop_request,
    get_employee_id,
    get_fresh_client_id,
    get_fresh_employee_id,
    get_open_barbershop_id,
    get_random_working_days,
    get_random_working_days_pair,
)
from domain.dtos import ErrorResponse, MessageResponse
from domain.dtos.barbershops import (
    AssignBarbershopEmployeeRequest,
    BarbershopEmployeeResponse,
)
from domain.dtos.employees import EmployeeResponse
from domain.utils import random_subset
from domain.value_objects import DayOfWeek, TimeOfDay, WorkingDays
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import BARBERSHOP_NOT_FOUND, USER_NOT_FOUND

_DEFAULT_START_TIME = TimeOfDay("09:00:00")
_DEFAULT_END_TIME = TimeOfDay("17:00:00")
_DEFAULT_WORKING_DAYS = DayOfWeek.from_list([1, 2, 3])
_ALL_DAY_NAMES = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

# Message responses
_EMPLOYEE_ASSIGNED = MessageResponse(message="Employee assigned to barbershop")

# Error responses
_NOT_VALID_ROLE = ErrorResponse(error="Only barbers and assistants can be employees")
_START_DIFFERENT_FROM_END = ErrorResponse(
    error="Start time must be different from end time"
)
_START_BEFORE_END = ErrorResponse(error="Start time must be earlier than end time")
_START_AFTER_BARBERSHOP_OPENING = ErrorResponse(
    error="Start time cannot be earlier than the barbershop opening time"
)
_END_BEFORE_BARBERSHOP_CLOSING = ErrorResponse(
    error="End time cannot be later than the barbershop closing time"
)
_ALREADY_ASSIGNED = ErrorResponse(
    error="Employee is already assigned to this barbershop"
)
_SCHEDULE_CONFLICT_PREFIX = "The employee already has an overlapping schedule on"


def _valid_request(
    *,
    start_time: TimeOfDay = _DEFAULT_START_TIME,
    end_time: TimeOfDay = _DEFAULT_END_TIME,
    working_days: WorkingDays = _DEFAULT_WORKING_DAYS,
) -> AssignBarbershopEmployeeRequest:
    return AssignBarbershopEmployeeRequest(
        start_time=start_time, end_time=end_time, working_days=working_days
    )


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    first_days, second_days = get_random_working_days_pair()
    employee_id = get_fresh_employee_id(client, working_days=first_days)

    barbershop_id = get_open_barbershop_id(client)
    return client.barbershops.assign_employee(
        barbershop_id, employee_id, _valid_request(working_days=second_days)
    )


def test_status(response: requests.Response) -> None:
    """
    Successful assignment returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_body(response: requests.Response) -> None:
    """
    Successful assignment returns the confirmation message.
    """

    assert_body(response, _EMPLOYEE_ASSIGNED)


def test_employee_appears_in_list_after_assignment(client: ApiClient) -> None:
    """
    Assigned employee appears in GET.
    """

    first_days, second_days = get_random_working_days_pair()
    employee_id = get_fresh_employee_id(client, working_days=first_days)

    barbershop_id = get_open_barbershop_id(client)
    client.barbershops.assign_employee(
        barbershop_id, employee_id, _valid_request(working_days=second_days)
    )

    response = client.barbershops.get_employees(barbershop_id)
    employees = BarbershopEmployeeResponse.from_array_response(response)
    assert any(employee_id == employee._id for employee in employees)


def test_assignment_schedule_stored_correctly(client: ApiClient) -> None:
    """
    The stored assignment reflects the exact startTime, endTime and workingDays sent.
    """

    start_time, end_time = TimeOfDay.random_sorted_times(n=2)
    first_days, second_days = get_random_working_days_pair()
    employee_id = get_fresh_employee_id(client, working_days=first_days)

    barbershop_id = get_open_barbershop_id(client)
    response = client.barbershops.assign_employee(
        barbershop_id,
        employee_id,
        _valid_request(
            start_time=start_time, end_time=end_time, working_days=second_days
        ),
    )

    response = client.employees.get(employee_id)
    employee = EmployeeResponse.from_response(response)
    stored = next(
        (
            assignment
            for assignment in employee.assignments
            if assignment.barbershop_id == barbershop_id
        ),
        None,
    )

    assert stored is not None
    assert stored.start_time == start_time.value
    assert stored.end_time == end_time.value
    assert stored.working_days == [day.value for day in second_days]


def test_unknown_barbershop_returns_not_found(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    employee_id = get_fresh_employee_id(client)
    response = client.barbershops.assign_employee(
        NON_EXISTENT_ID, employee_id, _valid_request()
    )

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)


def test_unknown_employee_returns_not_found(client: ApiClient) -> None:
    """
    Unknown employee returns 404.
    """

    barbershop_id = get_open_barbershop_id(client)
    response = client.barbershops.assign_employee(
        barbershop_id, NON_EXISTENT_ID, _valid_request()
    )

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, USER_NOT_FOUND)


def test_already_assigned_returns_conflict(client: ApiClient) -> None:
    """
    Assigning an employee to a barbershop they are already assigned to
    returns 409.
    """

    barbershop_id = get_open_barbershop_id(client)
    employee_id = get_employee_id(client, barbershop_id)

    response = client.barbershops.assign_employee(
        barbershop_id, employee_id, _valid_request()
    )

    assert_status(response, HttpStatus.CONFLICT)
    assert_body(response, _ALREADY_ASSIGNED)


def test_client_user_cannot_be_assigned(client: ApiClient) -> None:
    """
    Assigning a client user returns 422.
    """

    client_id = get_fresh_client_id(client)
    barbershop_id = get_open_barbershop_id(client)

    response = client.barbershops.assign_employee(
        barbershop_id, client_id, _valid_request()
    )

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _NOT_VALID_ROLE)


def test_equal_start_and_end_time(client: ApiClient) -> None:
    """
    startTime == endTime returns 422.
    """

    employee_id = get_fresh_employee_id(client)
    new_barbershop_id = get_open_barbershop_id(client)

    start_time = TimeOfDay.random()
    response = client.barbershops.assign_employee(
        new_barbershop_id,
        employee_id,
        _valid_request(start_time=start_time, end_time=start_time),
    )

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _START_DIFFERENT_FROM_END)


def test_start_time_must_be_before_end_time(client: ApiClient) -> None:
    """
    startTime later than endTime returns 422.
    """

    employee_id = get_fresh_employee_id(client)
    new_barbershop_id = get_open_barbershop_id(client)

    start_time, end_time = TimeOfDay.random_sorted_times(n=2)
    response = client.barbershops.assign_employee(
        new_barbershop_id,
        employee_id,
        _valid_request(start_time=end_time, end_time=start_time),
    )

    assert_body(response, _START_BEFORE_END)
    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)


def test_start_time_before_barbershop_opens(client: ApiClient) -> None:
    """
    startTime earlier than the barbershop's opensAt returns 422.
    """

    time_a, time_b, time_c, time_d = TimeOfDay.random_sorted_times(n=4)

    employee_id = get_fresh_employee_id(client)
    barbershop_id = get_barbershop_id_from_request(
        client, get_barbershop_request(opens_at=time_b.value, closes_at=time_d.value)
    )

    response = client.barbershops.assign_employee(
        barbershop_id, employee_id, _valid_request(start_time=time_a, end_time=time_c)
    )

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _START_AFTER_BARBERSHOP_OPENING)


def test_end_time_after_barbershop_closes(client: ApiClient) -> None:
    """
    endTime later than the barbershop's closesAt returns 422.
    """

    time_a, time_b, time_c, time_d = TimeOfDay.random_sorted_times(n=4)

    employee_id = get_fresh_employee_id(client)
    barbershop_id = get_barbershop_id_from_request(
        client, get_barbershop_request(opens_at=time_a.value, closes_at=time_c.value)
    )

    response = client.barbershops.assign_employee(
        barbershop_id, employee_id, _valid_request(start_time=time_b, end_time=time_d)
    )

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _END_BEFORE_BARBERSHOP_CLOSING)


def test_schedule_conflict_same_days_overlapping_hours(client: ApiClient) -> None:
    """
    Employee assignment with both days and hours overlap returns 409.
    """

    time_a, time_b, time_c, time_d = TimeOfDay.random_sorted_times(n=4)
    first_days = get_random_working_days(min_len=2)
    second_days = sorted(random_subset(first_days), key=lambda day: day.value)

    barbershop_id = get_open_barbershop_id(client)
    employee_id = get_fresh_employee_id(
        client, start_time=time_a, end_time=time_c, working_days=first_days
    )

    response = client.barbershops.assign_employee(
        barbershop_id,
        employee_id,
        _valid_request(start_time=time_b, end_time=time_d, working_days=second_days),
    )

    error_message = ErrorResponse.from_response(response).error
    days_in_message = ", ".join(_ALL_DAY_NAMES[day.value - 1] for day in second_days)

    assert_status(response, HttpStatus.CONFLICT)
    assert error_message is not None
    assert error_message.startswith(_SCHEDULE_CONFLICT_PREFIX)
    assert error_message.endswith(days_in_message)


def test_no_conflict_different_days(client: ApiClient) -> None:
    """
    Employee with completely disjoint working days means no conflict.
    """

    first_days, second_days = get_random_working_days_pair()
    employee_id = get_fresh_employee_id(client, working_days=first_days)

    barbershop_id = get_open_barbershop_id(client)
    response = client.barbershops.assign_employee(
        barbershop_id, employee_id, _valid_request(working_days=second_days)
    )

    assert_status(response, HttpStatus.OK)
    assert_body(response, _EMPLOYEE_ASSIGNED)


def test_no_conflict_non_overlapping_hours(client: ApiClient) -> None:
    """
    Employee working same days at different barbershops but hours
    do not overlap.
    """

    time_a, time_b, time_c, time_d = TimeOfDay.random_sorted_times(n=4)
    working_days = get_random_working_days()

    barbershop_id = get_open_barbershop_id(client)
    employee_id = get_fresh_employee_id(
        client, start_time=time_a, end_time=time_b, working_days=working_days
    )

    response = client.barbershops.assign_employee(
        barbershop_id,
        employee_id,
        _valid_request(start_time=time_c, end_time=time_d, working_days=working_days),
    )

    assert_status(response, HttpStatus.OK)
    assert_body(response, _EMPLOYEE_ASSIGNED)


def test_no_conflict_adjacent_hours_boundary(client: ApiClient) -> None:
    """
    Employee working same days at different barbershops but end time of
    one exactly equals start of the other, which is not an overlap.
    """

    time_a, time_b, time_c = TimeOfDay.random_sorted_times(n=3)
    working_days = get_random_working_days()

    barbershop_id = get_open_barbershop_id(client)
    employee_id = get_fresh_employee_id(
        client, start_time=time_a, end_time=time_b, working_days=working_days
    )

    response = client.barbershops.assign_employee(
        barbershop_id,
        employee_id,
        _valid_request(start_time=time_b, end_time=time_c, working_days=working_days),
    )

    assert_status(response, HttpStatus.OK)
    assert_body(response, _EMPLOYEE_ASSIGNED)
