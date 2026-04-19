"""
Tests for POST /api/barbershops
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import get_open_barbershop_request
from domain.dtos.barbershops import CreateBarbershopRequest, CreateBarbershopResponse
from domain.dtos.base_response import ErrorResponse
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)

_EMAIL_ALREADY_IN_USE = ErrorResponse(error="Barbershop email already in use")


@pytest.fixture(scope="module")
def barbershop_request() -> CreateBarbershopRequest:
    return get_open_barbershop_request()


@pytest.fixture(scope="module")
def response(
    client: ApiClient, barbershop_request: CreateBarbershopRequest
) -> requests.Response:
    return client.barbershops.create(barbershop_request)


def test_status(response: requests.Response) -> None:
    """
    Successful barbershop creation returns 201.
    """

    assert_status(response, HttpStatus.CREATED)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(response, CreateBarbershopResponse)


def test_is_not_active_by_default(response: requests.Response) -> None:
    """
    Newly created barbershops are not active by default.
    """

    barbershop = CreateBarbershopResponse.from_response(response)
    assert barbershop.is_active is False


def test_email_matches_input(
    response: requests.Response, barbershop_request: CreateBarbershopRequest
) -> None:
    """
    Response email matches the submitted email.
    """

    barbershop = CreateBarbershopResponse.from_response(response)
    assert barbershop.email == barbershop_request.email.value


def test_duplicate_email(
    client: ApiClient, barbershop_request: CreateBarbershopRequest
) -> None:
    """
    Creating a barbershop with a duplicate email returns 409.
    """

    response = client.barbershops.create(barbershop_request)

    assert_status(response, HttpStatus.CONFLICT)
    assert_body(response, _EMAIL_ALREADY_IN_USE)
