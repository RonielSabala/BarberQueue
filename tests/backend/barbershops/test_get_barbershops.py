import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos.barbershops import BarbershopResponse, CreateBarbershopRequest
from helpers.assertions import (
    assert_content_type,
    assert_list_body_shape,
    assert_status,
)


@pytest.fixture(scope="module")
def setup_data(client: ApiClient) -> None:
    request = CreateBarbershopRequest.random(barbershop_name="Alpha Barber")
    client.barbershops.create(request)


@pytest.fixture(scope="module")
def response(client: ApiClient, setup_data: None) -> requests.Response:
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


def test_search_filter(client: ApiClient, setup_data: None) -> None:
    """
    Filtering by name returns only matching results.
    """

    response = client.barbershops.get_all(search="Alpha")
    body = response.json()
    assert body[0]["barbershopName"] == "Alpha Barber"


def test_status_filter(client: ApiClient, setup_data: None) -> None:
    """
    Filtering by isOpen returns correct status.
    """

    response = client.barbershops.get_all(is_open=True)
    body = response.json()
    assert all(barbershop["isOpen"] is True for barbershop in body)
