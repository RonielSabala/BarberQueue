import pytest

from api.client import ApiClient
from domain.dtos.barbershops import CreateBarbershopRequest
from domain.value_objects.id import Id

_SEEDED_ADMIN_ID = 1
NON_EXISTENT_ID = 999_999


def get_barbershop_request(**kwargs) -> CreateBarbershopRequest:
    return CreateBarbershopRequest.random(admin_id=Id(_SEEDED_ADMIN_ID), **kwargs)


@pytest.fixture(scope="module")
def barbershop_request() -> CreateBarbershopRequest:
    return get_barbershop_request()


@pytest.fixture(scope="module")
def barbershop_id(client: ApiClient) -> int:
    response = client.barbershops.create(get_barbershop_request())
    return response.json()["id"]
