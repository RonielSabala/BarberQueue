import random
from collections.abc import Iterable
from dataclasses import dataclass

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
from domain.enums import BarberStatusEnum, EmployeeRoleEnum
from domain.value_objects import BarberStatus, Capacity, DayOfWeek, Id, WorkingDays
from domain.value_objects.day_of_week import MAX_DAY_OF_WEEK, MIN_DAY_OF_WEEK

# Ids
_SEEDED_ADMIN_ID = Id(1)
NON_EXISTENT_ID = 999_999

# Times
_DEFAULT_BARBERSHOP_OPENS_AT = "00:00:00"
_DEFAULT_OPEN_BARBERSHOP_CLOSES_AT = "23:59:59"
_DEFAULT_CLOSED_BARBERSHOP_CLOSES_AT = "00:00:01"

# Days
_ALL_DAYS = tuple(range(MIN_DAY_OF_WEEK, MAX_DAY_OF_WEEK + 1))

# Requests
_ACTIVE_BARBER_STATUS_REQUEST = UpdateBarberStatusRequest(
    current_status=BarberStatus(BarberStatusEnum.ACTIVE), is_accepting=True
)

# Requests helpers


def get_barbershop_request(**kwargs) -> CreateBarbershopRequest:
    return CreateBarbershopRequest.random(
        admin_id=_SEEDED_ADMIN_ID, capacity=Capacity._max_value, **kwargs
    )


def get_open_barbershop_request() -> CreateBarbershopRequest:
    return get_barbershop_request(
        opens_at=_DEFAULT_BARBERSHOP_OPENS_AT,
        closes_at=_DEFAULT_OPEN_BARBERSHOP_CLOSES_AT,
    )


def get_closed_barbershop_request() -> CreateBarbershopRequest:
    return get_barbershop_request(
        opens_at=_DEFAULT_BARBERSHOP_OPENS_AT,
        closes_at=_DEFAULT_CLOSED_BARBERSHOP_CLOSES_AT,
    )


# Ids helpers


def get_barbershop_id_from_request(
    client: ApiClient, request: CreateBarbershopRequest
) -> int:
    response = client.barbershops.create(request)
    return response.json()["id"]


def get_open_barbershop_id(
    client: ApiClient, barbershop_request: CreateBarbershopRequest | None = None
) -> int:
    if barbershop_request is None:
        barbershop_request = get_open_barbershop_request()

    barbershop_id = get_barbershop_id_from_request(client, barbershop_request)

    status_request = UpdateBarbershopStatusRequest(is_active=True)
    client.barbershops.update_status(barbershop_id, status_request)

    return barbershop_id


def get_closed_barbershop_id(
    client: ApiClient, barbershop_request: CreateBarbershopRequest | None = None
) -> int:
    if barbershop_request is None:
        barbershop_request = get_closed_barbershop_request()

    barbershop_id = get_barbershop_id_from_request(client, barbershop_request)

    status_request = UpdateBarbershopStatusRequest(is_active=False)
    client.barbershops.update_status(barbershop_id, status_request)

    return barbershop_id


def get_employee_id(client: ApiClient, barbershop_id: int, **kwargs) -> int:
    request = CreateBarbershopEmployeeRequest.random(**kwargs)
    response = client.barbershops.create_employee(barbershop_id, request)
    return response.json()["id"]


def get_fresh_client_id(client: ApiClient) -> int:
    request = RegisterRequest.random()
    response = client.auth.register(request)
    return response.json()["id"]


def get_fresh_employee_id(client: ApiClient, **kwargs) -> int:
    barbershop_id = get_open_barbershop_id(client)
    return get_employee_id(client, barbershop_id, **kwargs)


def get_fresh_barber_id(client: ApiClient) -> int:
    return get_fresh_employee_id(client, role=EmployeeRoleEnum.BARBER)


def get_active_barber_id(client: ApiClient, barbershop_id: int) -> int:
    barber_id = get_employee_id(client, barbershop_id, role=EmployeeRoleEnum.BARBER)
    client.barbers.update_status(barber_id, _ACTIVE_BARBER_STATUS_REQUEST)
    return barber_id


# Working days helpers


def get_random_working_days(
    min_len: int = MIN_DAY_OF_WEEK,
    max_len: int = MAX_DAY_OF_WEEK,
    exclude: Iterable[DayOfWeek] = (),
) -> WorkingDays:
    excluded = tuple(day.value for day in exclude)
    available_days = [day for day in _ALL_DAYS if day not in excluded]
    if not available_days:
        return []

    max_len = min(max_len, len(available_days))
    min_len = min(min_len, max_len)

    k = random.randint(min_len, max_len)
    selected_days = random.sample(available_days, k)
    return [DayOfWeek(day) for day in sorted(selected_days)]


def get_random_working_days_pair() -> tuple[WorkingDays, WorkingDays]:
    first_days = get_random_working_days(max_len=MAX_DAY_OF_WEEK - 1)
    second_days = get_random_working_days(exclude=first_days)
    return first_days, second_days


# Turn helpers


def checked_in(client: ApiClient, barbershop_id: int) -> int:
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
    turn_request = CreateTurnRequest(
        client_id=Id(client_id),
        barbershop_id=Id(barbershop_id),
        barber_id=None,
        group_members=[
            CreateTurnMemberRequest.random(member_name=name, optional_chance=0)
            for name in member_names
        ],
    )

    response = client.turns.create_turn(turn_request)
    return response.json()


# Fixtures


@pytest.fixture(scope="module")
def open_barbershop_id(client: ApiClient) -> int:
    return get_open_barbershop_id(client)


@pytest.fixture(scope="module")
def active_barber_id(client: ApiClient, open_barbershop_id: int) -> int:
    return get_active_barber_id(client, open_barbershop_id)


@dataclass(slots=True, kw_only=True, frozen=True)
class LiveTurnData:
    turn_id: int
    client_id: int
    barber_id: int


@pytest.fixture(scope="module")
def live_turn(
    client: ApiClient, open_barbershop_id: int, active_barber_id: int
) -> LiveTurnData:
    client_id = checked_in(client, open_barbershop_id)
    turn_id = create_solo_turn(client, open_barbershop_id, active_barber_id, client_id)
    return LiveTurnData(
        turn_id=turn_id, client_id=client_id, barber_id=active_barber_id
    )
