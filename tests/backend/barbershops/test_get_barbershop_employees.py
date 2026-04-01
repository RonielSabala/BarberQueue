"""
Tests for GET /api/barbershops/{id}/employees
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos.barbershops import (
    BarbershopEmployeeResponse,
    CreateBarbershopEmployeeRequest,
)
from helpers.assertions import (
    assert_body,
    assert_content_type,
    assert_list_body_shape,
    assert_status,
)
from helpers.common_responses import BARBERSHOP_NOT_FOUND


@pytest.fixture(scope="module")
def response(client: ApiClient, barbershop_id: int) -> requests.Response:
    request = CreateBarbershopEmployeeRequest.random_employee()
    client.barbershops.create_employee(barbershop_id, request)
    return client.barbershops.get_employees(barbershop_id)


def test_status(response: requests.Response) -> None:
    """
    Successful employees listing returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(response: requests.Response) -> None:
    """
    Response body is a list of employees.
    """

    assert_list_body_shape(response, BarbershopEmployeeResponse)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    response = client.barbershops.get_employees(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
