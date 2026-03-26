import pytest

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos.auth import RegisterRequest
from domain.dtos.barbershops import (
    CreateBarbershopRequest,
    CreateBarbershopReviewRequest,
)
from domain.value_objects.rating import Rating
from domain.value_objects.review_content import ReviewContent
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import REVIEW_NOT_FOUND


@pytest.fixture(scope="module")
def review_context(client: ApiClient):
    shop_id = client.barbershops.create(CreateBarbershopRequest.random()).json()["id"]
    user_id = client.auth.register(RegisterRequest.random()).json()["id"]
    rev_res = client.barbershops.add_review(
        shop_id,
        CreateBarbershopReviewRequest(
            user_id=user_id, rating=Rating.random(), content=ReviewContent.random()
        ),
    )

    return {"shop_id": shop_id, "review_id": rev_res.json()["id"]}


def test_status(client: ApiClient, review_context: dict) -> None:
    """
    Successful review deletion returns 204.
    """

    response = client.barbershops.delete_review(
        review_context["shop_id"], review_context["review_id"]
    )
    assert_status(response, HttpStatus.NO_CONTENT)


def test_status_on_unknown_review(client: ApiClient, review_context: dict) -> None:
    """
    Deleting unknown review returns 404.
    """

    response = client.barbershops.delete_review(review_context["shop_id"], 9999)
    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, REVIEW_NOT_FOUND)
