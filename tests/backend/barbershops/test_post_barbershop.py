"""
Tests for POST /api/barbershops
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
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
def request_data() -> CreateBarbershopRequest:
    return CreateBarbershopRequest.random()


@pytest.fixture(scope="module")
def response(
    client: ApiClient, request_data: CreateBarbershopRequest
) -> requests.Response:
    return client.barbershops.create(request_data)


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


def test_is_active_by_default(response: requests.Response) -> None:
    """
    Newly created barbershops are active by default.
    """

    assert response.json()["isActive"] is True


def test_email_matches_input(
    response: requests.Response, request_data: CreateBarbershopRequest
) -> None:
    """
    Response email matches the submitted email.
    """

    assert response.json()["email"] == request_data.email.value


def test_duplicate_email(
    client: ApiClient, request_data: CreateBarbershopRequest
) -> None:
    """
    Creating a barbershop with a duplicate email returns 409.
    """

    response = client.barbershops.create(request_data)

    assert_status(response, HttpStatus.CONFLICT)
    assert_body(response, _EMAIL_ALREADY_IN_USE)
