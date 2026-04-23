"""
Tests for POST /api/barbershops/{id}/clients/{clientId}
"""

from api.client import ApiClient
from api.core import HttpStatus
from backend.conftest import (
    NON_EXISTENT_ID,
    get_closed_barbershop_id,
    get_employee_id,
    get_fresh_client_id,
)
from domain.dtos import ErrorResponse
from domain.dtos.barbershops import BarbershopClientResponse
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import BARBERSHOP_NOT_FOUND, USER_NOT_FOUND

_BARBERSHOP_NOT_OPEN = ErrorResponse(error="Barbershop is not open")
_ONLY_CLIENTS_CAN_CHECK_IN = ErrorResponse(
    error="Only clients can check in to a barbershop"
)
_CLIENT_ALREADY_IN_BARBERSHOP = ErrorResponse(
    error="Client is already active in a barbershop"
)


def test_status(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Successful check-in returns 204.
    """

    client_id = get_fresh_client_id(client)
    response = client.barbershops.check_in(open_barbershop_id, client_id)
    assert_status(response, HttpStatus.NO_CONTENT)


def test_client_appears_in_list_after_check_in(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Checked-in client appears in GET /api/barbershops/{id}/clients.
    """

    client_id = get_fresh_client_id(client)
    client.barbershops.check_in(open_barbershop_id, client_id)

    response = client.barbershops.get_clients(open_barbershop_id)
    clients = BarbershopClientResponse.from_array_response(response)

    assert any(client_id == client.client_id for client in clients)


def test_status_on_unknown_client(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Unknown client returns 404.
    """

    response = client.barbershops.check_in(open_barbershop_id, NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, USER_NOT_FOUND)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    client_id = get_fresh_client_id(client)
    response = client.barbershops.check_in(NON_EXISTENT_ID, client_id)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)


def test_closed_barbershop_returns_bad_request(client: ApiClient) -> None:
    """
    Checking in to a closed barbershop returns 400.
    """

    client_id = get_fresh_client_id(client)
    barbershop_id = get_closed_barbershop_id(client)
    response = client.barbershops.check_in(barbershop_id, client_id)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _BARBERSHOP_NOT_OPEN)


def test_non_client_role_cannot_check_in(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Barber/assistant cannot check in. Returns 403.
    """

    employee_id = get_employee_id(client, open_barbershop_id)
    response = client.barbershops.check_in(open_barbershop_id, employee_id)

    assert_status(response, HttpStatus.FORBIDDEN)
    assert_body(response, _ONLY_CLIENTS_CAN_CHECK_IN)


def test_already_checked_in_client_returns_conflict(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Client already active in a barbershop returns 409.
    """

    client_id = get_fresh_client_id(client)
    client.barbershops.check_in(open_barbershop_id, client_id)
    response = client.barbershops.check_in(open_barbershop_id, client_id)

    assert_status(response, HttpStatus.CONFLICT)
    assert_body(response, _CLIENT_ALREADY_IN_BARBERSHOP)
