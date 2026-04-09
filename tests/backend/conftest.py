import pytest

from api.client import ApiClient
from domain.dtos.auth import RegisterRequest
from domain.dtos.barbers import UpdateBarberStatusRequest
from domain.dtos.barbershops import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopRequest,
    UpdateBarbershopStatusRequest,
)
from domain.dtos.turns import CreateTurnMemberRequest, CreateTurnRequest
from domain.enums import BarberStatusEnum, RoleEnum
from domain.value_objects import BarberStatus, Id, TimeOfDay

_SEEDED_ADMIN_ID = 1
NON_EXISTENT_ID = 999_999


def _get_barbershop_request(**kwargs) -> CreateBarbershopRequest:
    return CreateBarbershopRequest.random(admin_id=Id(_SEEDED_ADMIN_ID), **kwargs)


def get_open_barbershop_request() -> CreateBarbershopRequest:
    opens_at = TimeOfDay.random()
    return _get_barbershop_request(opens_at=opens_at, closes_at=opens_at)


def get_closed_barbershop_request() -> CreateBarbershopRequest:
    opens_at = "00:00:00"
    closed_at = "00:00:01"
    return _get_barbershop_request(opens_at=opens_at, closes_at=closed_at)


def get_open_barbershop_id(client: ApiClient) -> int:
    request = get_open_barbershop_request()
    response = client.barbershops.create(request)
    return response.json()["id"]


def get_active_barber_id(client: ApiClient, barbershop_id: int) -> int:
    employee_request = CreateBarbershopEmployeeRequest.random(role=RoleEnum.BARBER)
    employee_response = client.barbershops.create_employee(
        barbershop_id, employee_request
    )
    employee_id = employee_response.json()["id"]

    update_status_request = UpdateBarberStatusRequest(
        current_status=BarberStatus(BarberStatusEnum.ACTIVE), is_accepting=True
    )
    client.barbers.update_status(employee_id, update_status_request)

    return employee_id


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


def checked_in(client: ApiClient, barbershop_id: int) -> int:
    """
    Register and check in a fresh client. Returns the client_id.
    """

    client_id = get_fresh_client_id(client)
    client.barbershops.check_in(barbershop_id, client_id)
    return client_id


def create_solo_turn(
    client: ApiClient, barbershop_id: int, barber_id: int, client_id: int
) -> int:
    request = CreateTurnRequest.random(
        client_id=client_id,
        barbershop_id=barbershop_id,
        barber_id=barber_id,
        group_members=None,
    )

    response = client.turns.create_turn(request)
    return response.json()[0]["id"]


def create_group_turn(
    client: ApiClient, barbershop_id: int, client_id: int, member_names: list[str]
) -> list[dict]:
    group_members_request = [
        CreateTurnMemberRequest.random(member_name=name, optional_chance=0)
        for name in member_names
    ]
    turn_request = CreateTurnRequest(
        client_id=Id(client_id),
        barbershop_id=Id(barbershop_id),
        barber_id=None,
        group_members=group_members_request,
    )

    response = client.turns.create_turn(turn_request)
    return response.json()


@pytest.fixture(scope="module")
def barbershop_request() -> CreateBarbershopRequest:
    return _get_barbershop_request()


@pytest.fixture(scope="module")
def barbershop_id(client: ApiClient) -> int:
    request = _get_barbershop_request()
    response = client.barbershops.create(request)
    return response.json()["id"]


@pytest.fixture(scope="module")
def open_barbershop_id(client: ApiClient) -> int:
    return get_open_barbershop_id(client)


@pytest.fixture(scope="module")
def closed_barbershop_id(client: ApiClient) -> int:
    barbershop_request = get_closed_barbershop_request()
    barbershop_response = client.barbershops.create(barbershop_request)
    barbershop_id = barbershop_response.json()["id"]

    status_request = UpdateBarbershopStatusRequest(is_active=False)
    client.barbershops.update_status(barbershop_id, status_request)
    return barbershop_id


@pytest.fixture(scope="module")
def active_barber_id(client: ApiClient, open_barbershop_id: int) -> int:
    return get_active_barber_id(client, open_barbershop_id)


@pytest.fixture(scope="module")
def live_turn(
    client: ApiClient, open_barbershop_id: int, active_barber_id: int
) -> dict:
    client_id = checked_in(client, open_barbershop_id)
    turn_id = create_solo_turn(client, open_barbershop_id, active_barber_id, client_id)
    return {"turn_id": turn_id, "client_id": client_id, "barber_id": active_barber_id}
