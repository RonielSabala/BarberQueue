"""
Tests for DELETE /api/barbershops/{id}/clients/{clientId}
"""

from api.client import ApiClient
from api.core import HttpStatus
from backend.conftest import (
    NON_EXISTENT_ID,
    get_fresh_client_id,
    get_open_barbershop_request,
)
from domain.dtos import ErrorResponse
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import (
    BARBERSHOP_NOT_FOUND,
    CLIENT_NOT_AT_BARBERSHOP,
    CLIENT_NOT_FOUND,
)

_SEEDED_ON_QUEUE_CLIENT_ID = 10
_DIFFERENT_BARBERSHOP = ErrorResponse(
    error="The client is registered at a different barbershop location"
)
_INVALID_STATUS = ErrorResponse(
    error="Client must have status 'at_barbershop' or 'paid' to check out"
)


def _checked_in_client(client: ApiClient, barbershop_id: int) -> int:
    client_id = get_fresh_client_id(client)
    client.barbershops.check_in(barbershop_id, client_id)
    return client_id


def test_status(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Successful check-out returns 204.
    """

    client_id = _checked_in_client(client, open_barbershop_id)
    response = client.barbershops.check_out(open_barbershop_id, client_id)
    assert_status(response, HttpStatus.NO_CONTENT)


def test_client_no_longer_in_list(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Checked-out client no longer appears in GET /api/barbershops/{id}/clients.
    """

    client_id = _checked_in_client(client, open_barbershop_id)
    client.barbershops.check_out(open_barbershop_id, client_id)

    response = client.barbershops.get_clients(open_barbershop_id)
    assert all(client_id != client["clientId"] for client in response.json())


def test_status_on_unknown_client(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Unknown client returns 404.
    """

    response = client.barbershops.check_out(open_barbershop_id, NON_EXISTENT_ID)

    assert_body(response, CLIENT_NOT_FOUND)
    assert_status(response, HttpStatus.NOT_FOUND)


def test_status_on_unknown_barbershop(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Unknown barbershop returns 404.
    """

    client_id = _checked_in_client(client, open_barbershop_id)
    response = client.barbershops.check_out(NON_EXISTENT_ID, client_id)

    assert_body(response, BARBERSHOP_NOT_FOUND)
    assert_status(response, HttpStatus.NOT_FOUND)


def test_default_status_client_cannot_check_out(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Client with status 'default' returns 400.
    """

    client_id = get_fresh_client_id(client)
    response = client.barbershops.check_out(open_barbershop_id, client_id)

    assert_status(response, HttpStatus.BAD_REQUEST)
    assert_body(response, CLIENT_NOT_AT_BARBERSHOP)


def test_client_at_different_barbershop_cannot_check_out(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Client checked in at barbershop `A` cannot check out from
    barbershop `B`.
    """

    barbershop_request = get_open_barbershop_request()
    barbershop_response = client.barbershops.create(barbershop_request)
    other_barbershop_id = barbershop_response.json()["id"]

    client_id = _checked_in_client(client, open_barbershop_id)
    response = client.barbershops.check_out(other_barbershop_id, client_id)

    assert_status(response, HttpStatus.CONFLICT)
    assert_body(response, _DIFFERENT_BARBERSHOP)


def test_wrong_role_cannot_check_out(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Client with wrong roles cannot check out. Returns 403.
    """

    response = client.barbershops.check_out(
        open_barbershop_id, _SEEDED_ON_QUEUE_CLIENT_ID
    )

    assert_body(response, _INVALID_STATUS)
    assert_status(response, HttpStatus.FORBIDDEN)
