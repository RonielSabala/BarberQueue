"""
Tests for POST /api/turns
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import (
    NON_EXISTENT_ID,
    checked_in,
    create_group_turn,
    create_solo_turn,
    get_fresh_client_id,
)
from domain.dtos import ErrorResponse
from domain.dtos.turns import CreateTurnRequest, TurnDetailResponse
from domain.enums import ClientStatusEnum, OwnerTypeEnum
from helpers.assertions import (
    assert_body,
    assert_content_type,
    assert_list_body_shape,
    assert_status,
)
from helpers.common_responses import BARBERSHOP_NOT_FOUND, CLIENT_NOT_FOUND

_NOT_AT_BARBERSHOP = ErrorResponse(
    error="Client must have status 'at_barbershop' to join the queue"
)


@pytest.fixture(scope="module")
def response(
    client: ApiClient, open_barbershop_id: int, active_barber_id: int
) -> requests.Response:
    client_id = checked_in(client, open_barbershop_id)
    request = CreateTurnRequest.random(
        client_id=client_id,
        barbershop_id=open_barbershop_id,
        barber_id=active_barber_id,
        group_members=None,
    )

    return client.turns.create_turn(request)


def test_status(response: requests.Response) -> None:
    """
    Successful turn creation returns 201.
    """

    assert_status(response, HttpStatus.CREATED)


def test_content_type(response: requests.Response) -> None:
    """
    Response is JSON.
    """

    assert_content_type(response, HttpHeader.JSON)


def test_body_shape(response: requests.Response) -> None:
    """
    Response is a list of turn detail objects.
    """

    assert_list_body_shape(response, TurnDetailResponse)


def test_returns_one_turn_without_group(response: requests.Response) -> None:
    """
    Without groupMembers, response contains exactly one turn.
    """

    assert len(response.json()) == 1


def test_leader_turn_has_client_owner_type(response: requests.Response) -> None:
    """
    The leader turn has ownerType='client'.
    """

    assert response.json()[0]["ownerType"] == OwnerTypeEnum.CLIENT


def test_barber_id_matches(response: requests.Response, active_barber_id: int) -> None:
    """
    Assigned barber matches the requested barber.
    """

    assert response.json()[0]["barberId"] == active_barber_id


def test_client_status_becomes_on_queue(
    client: ApiClient, open_barbershop_id: int, active_barber_id: int
) -> None:
    """
    After turn creation, client status becomes on_queue (or in_service if position 1).
    """

    client_id = checked_in(client, open_barbershop_id)
    create_solo_turn(client, open_barbershop_id, active_barber_id, client_id)

    turn_response = client.clients.get_turn(client_id)
    assert turn_response.json()["status"] in (
        ClientStatusEnum.ON_QUEUE,
        ClientStatusEnum.IN_SERVICE,
    )


def test_group_turn_creates_member_turns(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Providing groupMembers creates additional turns for each member.
    """

    client_id = checked_in(client, open_barbershop_id)
    turns_response = create_group_turn(
        client, open_barbershop_id, client_id, ["member1", "member2"]
    )

    assert len(turns_response) == 3

    owner_types = [turn["ownerType"] for turn in turns_response]
    assert owner_types.count(OwnerTypeEnum.CLIENT) == 1
    assert owner_types.count(OwnerTypeEnum.MEMBER) == 2


def test_group_turns_share_group_id(client: ApiClient, open_barbershop_id: int) -> None:
    """
    All turns in a group share the same groupId.
    """

    client_id = checked_in(client, open_barbershop_id)
    turns_response = create_group_turn(
        client, open_barbershop_id, client_id, ["member1", "member2"]
    )

    group_ids = {turn["groupId"] for turn in turns_response}
    assert len(group_ids) == 1
    assert None not in group_ids


def test_auto_assign_without_barber_id(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Omitting barberId auto-assigns the turn to the best available barber.
    """

    client_id = checked_in(client, open_barbershop_id)
    turn_request = CreateTurnRequest.random(
        client_id=client_id, barbershop_id=open_barbershop_id, barber_id=None
    )

    response = client.turns.create_turn(turn_request)

    assert_status(response, HttpStatus.CREATED)
    assert len(response.json()) == 1


def test_not_at_barbershop_returns_unprocessable(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Client without at_barbershop status returns 422.
    """

    client_id = get_fresh_client_id(client)
    turn_request = CreateTurnRequest.random(
        client_id=client_id, barbershop_id=open_barbershop_id
    )
    response = client.turns.create_turn(turn_request)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _NOT_AT_BARBERSHOP)


def test_unknown_client_returns_not_found(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Unknown client returns 404.
    """

    turn_request = CreateTurnRequest.random(
        client_id=NON_EXISTENT_ID, barbershop_id=open_barbershop_id
    )
    response = client.turns.create_turn(turn_request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, CLIENT_NOT_FOUND)


def test_unknown_barbershop_returns_not_found(
    client: ApiClient, open_barbershop_id: int
) -> None:
    """
    Unknown barbershop returns 404.
    """

    client_id = checked_in(client, open_barbershop_id)
    turn_request = CreateTurnRequest.random(
        client_id=client_id, barbershop_id=NON_EXISTENT_ID
    )
    response = client.turns.create_turn(turn_request)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
