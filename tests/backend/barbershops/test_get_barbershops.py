"""
Tests for GET /api/barbershops
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import (
    NON_EXISTENT_ID,
    get_open_barbershop_id,
    get_open_barbershop_request,
)
from domain.dtos.barbershops import BarbershopResponse
from domain.utils import random_bool
from domain.value_objects import BarbershopName
from helpers.assertions import (
    assert_content_type,
    assert_list_body_shape,
    assert_status,
)


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    return client.barbershops.get_all()


def test_status(response: requests.Response) -> None:
    """
    Successful barbershop listing returns 200.
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

    assert_list_body_shape(response, BarbershopResponse)


def test_search_filter(client: ApiClient) -> None:
    """
    Searching by name returns the matching barbershop.
    """

    request = get_open_barbershop_request()
    get_open_barbershop_id(client, request)

    barbershop_name = request.barbershop_name.value
    response = client.barbershops.get_all(search=barbershop_name)
    body = response.json()

    assert_list_body_shape(response, BarbershopResponse)
    assert any(barbershop["barbershopName"] == barbershop_name for barbershop in body)


def test_search_no_results(client: ApiClient) -> None:
    """
    Searching for a nonexistent name returns an empty list.
    """

    search_value = BarbershopName.random_value()
    response = client.barbershops.get_all(search=search_value)
    assert response.json() == []


def test_is_open_filter(client: ApiClient) -> None:
    """
    Filtering by isOpen returns barbershops matching the requested state.
    """

    is_open_value = random_bool()
    response = client.barbershops.get_all(is_open=is_open_value)
    body = response.json()

    assert_status(response, HttpStatus.OK)
    assert_list_body_shape(response, BarbershopResponse)
    assert all(barbershop["isOpen"] is is_open_value for barbershop in body)


def test_admin_id_filter_unknown_admin(client: ApiClient) -> None:
    """
    Filtering by a non-existent adminId returns an empty list.
    """

    response = client.barbershops.get_all(admin_id=NON_EXISTENT_ID)
    assert response.json() == []
