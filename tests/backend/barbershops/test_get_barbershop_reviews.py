import pytest
import requests

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos.barbershops import BarbershopReviewResponse, CreateBarbershopRequest
from helpers.assertions import assert_list_body_shape, assert_status


@pytest.fixture(scope="module")
def barbershop_id(client: ApiClient) -> int:
    return client.barbershops.create(CreateBarbershopRequest.random()).json()["id"]


@pytest.fixture(scope="module")
def response(client: ApiClient, barbershop_id: int) -> requests.Response:
    return client.barbershops.get_reviews(barbershop_id)


def test_status(response: requests.Response) -> None:
    """
    Successful review list retrieval returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_list_body_shape(response, BarbershopReviewResponse)
