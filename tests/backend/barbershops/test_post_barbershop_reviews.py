import pytest
import requests

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos.auth import RegisterRequest
from domain.dtos.barbershops import (
    BarbershopReviewResponse,
    CreateBarbershopRequest,
    CreateBarbershopReviewRequest,
)
from domain.value_objects.id import Id
from domain.value_objects.rating import Rating
from domain.value_objects.review_content import ReviewContent
from helpers.assertions import assert_body_shape, assert_status


@pytest.fixture(scope="module")
def review_data(client: ApiClient):
    shop_id = client.barbershops.create(CreateBarbershopRequest.random()).json()["id"]
    user_id = client.auth.register(RegisterRequest.random()).json()["id"]
    return {"shop_id": shop_id, "user_id": user_id}


@pytest.fixture(scope="module")
def response(client: ApiClient, review_data: dict) -> requests.Response:
    request = CreateBarbershopReviewRequest(
        user_id=Id(value=review_data["user_id"]),
        rating=Rating.random(),
        content=ReviewContent.random(),
    )

    return client.barbershops.add_review(review_data["shop_id"], request)


def test_status(response: requests.Response) -> None:
    """
    Successful review creation returns 201.
    """

    assert_status(response, HttpStatus.CREATED)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(response, BarbershopReviewResponse)
