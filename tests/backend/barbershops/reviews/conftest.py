import pytest
import requests

from api.client import ApiClient
from backend.conftest import get_fresh_client_id
from domain.dtos.barbershops import CreateBarbershopReviewRequest


@pytest.fixture(scope="module")
def create_review_response(
    client: ApiClient, open_barbershop_id: int
) -> requests.Response:
    client_id = get_fresh_client_id(client)
    review_request = CreateBarbershopReviewRequest.random(client_id=client_id)
    return client.barbershops.add_review(open_barbershop_id, review_request)
