import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from domain.dtos.barbershops import CreateBarbershopRequest, CreateBarbershopResponse
from helpers.assertions import assert_body_shape, assert_content_type, assert_status


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    request = CreateBarbershopRequest.random()
    return client.barbershops.create(request)


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
