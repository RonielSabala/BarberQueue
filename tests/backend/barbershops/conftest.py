import pytest

from api.client import ApiClient
from domain.dtos.barbershops import CreateBarbershopRequest


@pytest.fixture(scope="module")
def barbershop_id(client: ApiClient) -> int:
    request = CreateBarbershopRequest.random()
    response = client.barbershops.create(request)
    return response.json()["id"]
