"""
Tests for GET /api/clients/{id}/turn
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import (
    NON_EXISTENT_ID,
    checked_in,
    create_group_turn,
    get_fresh_client_id,
)
from domain.dtos import ErrorResponse
from domain.dtos.clients import ClientTurnResponse
from domain.enums import ClientStatusEnum
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import CLIENT_NOT_AT_BARBERSHOP, CLIENT_NOT_FOUND

SEEDED_CLIENT_WITH_TURN_ID = 17
SEEDED_CLIENT_WITH_UNASSIGNED_TURN_ID = 18

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


def test_unassigned_client_has_scheduler_position(client: ApiClient) -> None:
    """
    Unassigned client (no barber) gets a scheduler-computed position.
    """

    response = client.clients.get_turn(SEEDED_CLIENT_WITH_UNASSIGNED_TURN_ID)
    body = response.json()

    assert_status(response, HttpStatus.OK)
    assert body["position"] >= 1
    assert body["barberId"] is None


def test_turn_id_matches_created_turn(client: ApiClient, live_turn: dict) -> None:
    """
    Response turnId matches the turn that was created.
    """

    response = client.clients.get_turn(live_turn["client_id"])
    assert response.json()["id"] == live_turn["turn_id"]


def test_live_turn_has_valid_status(client: ApiClient, live_turn: dict) -> None:
    """
    A live turn has status on_queue or in_service.
    """

    response = client.clients.get_turn(live_turn["client_id"])
    assert response.json()["status"] in (
        ClientStatusEnum.ON_QUEUE,
        ClientStatusEnum.IN_SERVICE,
    )


def test_group_turn_includes_group_key(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    A group leader's turn includes the group key with member turns.
    """

    leader_id = checked_in(client, open_barbershop_id)
    create_group_turn(client, open_barbershop_id, leader_id, ["member1", "member2"])

    response = client.clients.get_turn(leader_id)
    body = response.json()

    assert body["group"] is not None
    assert "groupId" in body["group"]
    assert len(body["group"]["members"]) == 2


def test_non_group_turn_has_null_group(client: ApiClient, live_turn: dict) -> None:
    """
    A solo turn has group=null.
    """

    response = client.clients.get_turn(live_turn["client_id"])
    assert response.json()["group"] is None


def test_turn_id_matches_created_turn(client: ApiClient, live_turn: dict) -> None:
    """
    Response turnId matches the turn that was created.
    """

    response = client.clients.get_turn(live_turn["client_id"])
    assert response.json()["id"] == live_turn["turn_id"]


def test_live_turn_has_valid_status(client: ApiClient, live_turn: dict) -> None:
    """
    A live turn has status on_queue or in_service.
    """

    response = client.clients.get_turn(live_turn["client_id"])
    assert response.json()["status"] in (
        ClientStatusEnum.ON_QUEUE,
        ClientStatusEnum.IN_SERVICE,
    )


def test_group_turn_includes_group_key(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    A group leader's turn includes the group key with member turns.
    """

    leader_id = checked_in(client, open_barbershop_id)
    create_group_turn(client, open_barbershop_id, leader_id, ["member1", "member2"])

    response = client.clients.get_turn(leader_id)
    body = response.json()

    assert body["group"] is not None
    assert "groupId" in body["group"]
    assert len(body["group"]["members"]) == 2


def test_non_group_turn_has_null_group(client: ApiClient, live_turn: dict) -> None:
    """
    A solo turn has group=null.
    """

    response = client.clients.get_turn(live_turn["client_id"])
    assert response.json()["group"] is None


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

    client_id = checked_in(client, open_barbershop_id)
    response = client.clients.get_turn(client_id)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _NO_ACTIVE_TURN)
