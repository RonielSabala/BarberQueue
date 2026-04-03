"""
Tests for GET /api/clients/{id}/turn
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID, get_fresh_client_id
from domain.dtos import ErrorResponse
from domain.dtos.clients import ClientTurnResponse
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import CLIENT_NOT_AT_BARBERSHOP, CLIENT_NOT_FOUND

SEEDED_CLIENT_WITH_TURN_ID = 15
SEEDED_CLIENT_WITH_UNASSIGNED_TURN_ID = 17

_NO_ACTIVE_TURN = ErrorResponse(
    error="The client currently has no turn despite being in a barbershop"
)


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    return client.clients.get_turn(SEEDED_CLIENT_WITH_TURN_ID)


def test_status(response: requests.Response) -> None:
    """
    Successful client turn fetch returns 200.
    """

    assert_status(response, HttpStatus.OK)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(response: requests.Response) -> None:
    """
    Response contains expected fields.
    """

    assert_body_shape(response, ClientTurnResponse)


def test_position_is_positive(response: requests.Response) -> None:
    """
    Position is a positive integer.
    """

    assert response.json()["position"] >= 1


def test_unassigned_client_has_valid_position(client: ApiClient) -> None:
    """
    A unassigned client (no barber assigned) gets a scheduler-computed
    position.
    """

    response = client.clients.get_turn(SEEDED_CLIENT_WITH_UNASSIGNED_TURN_ID)
    assert response.json()["position"] >= 1
    assert response.json()["barberId"] is None


def test_status_on_unknown_client(client: ApiClient) -> None:
    """
    Unknown client returns 404.
    """

    response = client.clients.get_turn(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, CLIENT_NOT_FOUND)


def test_client_not_at_barbershop(client: ApiClient) -> None:
    """
    Client with status 'default' returns 400.
    """

    client_id = get_fresh_client_id(client)
    response = client.clients.get_turn(client_id)

    assert_status(response, HttpStatus.BAD_REQUEST)
    assert_body(response, CLIENT_NOT_AT_BARBERSHOP)


def test_client_with_no_turn(client: ApiClient, open_barbershop_id: int) -> None:
    """
    Client with no active turn returns 404.
    """

    client_id = get_fresh_client_id(client)
    client.barbershops.check_in(open_barbershop_id, client_id)

    response = client.clients.get_turn(client_id)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _NO_ACTIVE_TURN)
