import pytest

from api.client import ApiClient
from domain.dtos.auth import RegisterRequest
from domain.dtos.barbershops import (
    CreateBarbershopRequest,
    UpdateBarbershopStatusRequest,
)
from domain.dtos.barbershops.requests import CreateBarbershopEmployeeRequest
from domain.value_objects import TimeOfDay
from domain.value_objects.id import Id

_SEEDED_ADMIN_ID = 1
NON_EXISTENT_ID = 999_999


def get_barbershop_request(**kwargs) -> CreateBarbershopRequest:
    return CreateBarbershopRequest.random(admin_id=Id(_SEEDED_ADMIN_ID), **kwargs)


def get_open_barbershop_request() -> CreateBarbershopRequest:
    opens_at = TimeOfDay.random()
    return get_barbershop_request(opens_at=opens_at, closes_at=opens_at)


def get_closed_barbershop_request() -> CreateBarbershopRequest:
    opens_at = "00:00:00"
    closed_at = "00:00:01"
    return get_barbershop_request(opens_at=opens_at, closes_at=closed_at)


def get_fresh_client_id(client: ApiClient) -> int:
    request = RegisterRequest.random()
    response = client.auth.register(request)
    return response.json()["id"]


def get_fresh_employee_id(client: ApiClient, open_barbershop_id: int) -> int:
    employee_request = CreateBarbershopEmployeeRequest.random()
    employee_response = client.barbershops.create_employee(
        open_barbershop_id, employee_request
    )

    return employee_response.json()["id"]


@pytest.fixture(scope="module")
def barbershop_request() -> CreateBarbershopRequest:
    return get_barbershop_request()


@pytest.fixture(scope="module")
def barbershop_id(client: ApiClient) -> int:
    response = client.barbershops.create(get_barbershop_request())
    return response.json()["id"]


@pytest.fixture(scope="module")
def open_barbershop_id(client: ApiClient) -> int:
    request = get_open_barbershop_request()
    response = client.barbershops.create(request)
    return response.json()["id"]


@pytest.fixture(scope="module")
def closed_barbershop_id(client: ApiClient) -> int:
    barbershop_request = get_closed_barbershop_request()
    barbershop_response = client.barbershops.create(barbershop_request)
    barbershop_id = barbershop_response.json()["id"]

    status_request = UpdateBarbershopStatusRequest(is_active=False)
    client.barbershops.update_status(barbershop_id, status_request)
    return barbershop_id
