import pytest

from api.client import ApiClient
from domain.dtos.auth import RegisterRequest
from domain.dtos.barbershops import CreateBarbershopEmployeeRequest
from domain.enums import EmployeeRoleEnum


@pytest.fixture(scope="module")
def barber_id(client: ApiClient, barbershop_id: int) -> int:
    request = CreateBarbershopEmployeeRequest.random(role=EmployeeRoleEnum.BARBER)
    response = client.barbershops.create_employee(barbershop_id, request)
    return response.json()["id"]


@pytest.fixture(scope="module")
def client_id(client: ApiClient, barbershop_id: int) -> int:
    register_request = RegisterRequest.random()
    register_response = client.auth.register(register_request)
    return register_response.json()["id"]
