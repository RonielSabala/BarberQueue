"""
Tests for DELETE /api/turns/{id}
"""

from dataclasses import dataclass

import pytest

from api.client import ApiClient
from api.core import HttpStatus
from backend.conftest import (
    NON_EXISTENT_ID,
    checked_in,
    create_group_turn,
    create_solo_turn,
    get_active_barber_id,
    get_open_barbershop_id,
)
from domain.enums import ClientStatusEnum, OwnerTypeEnum
from helpers.assertions import assert_body, assert_status
from helpers.common_responses import TURN_NOT_FOUND


@dataclass(slots=True, kw_only=True, frozen=True)
class GroupTurnData:
    leader_id: int
    leader_turn_id: int
    member_turn_ids: list[int]


@pytest.fixture
def solo_turn_id(
    client: ApiClient, open_barbershop_id: int, active_barber_id: int
) -> int:
    client_id = checked_in(client, open_barbershop_id)
    return create_solo_turn(client, open_barbershop_id, active_barber_id, client_id)


@pytest.fixture
def group_turn(client: ApiClient, open_barbershop_id: int) -> GroupTurnData:
    leader_id = checked_in(client, open_barbershop_id)
    turns = create_group_turn(
        client, open_barbershop_id, leader_id, ["member1", "member2"]
    )

    leader_turn = next(
        turn for turn in turns if turn["ownerType"] == OwnerTypeEnum.CLIENT
    )
    member_turns = tuple(
        turn for turn in turns if turn["ownerType"] == OwnerTypeEnum.MEMBER
    )

    return GroupTurnData(
        leader_id=leader_id,
        leader_turn_id=leader_turn["id"],
        member_turn_ids=[turn["id"] for turn in member_turns],
    )


def test_status(client: ApiClient, solo_turn_id: int) -> None:
    """
    Successful turn deletion returns 204.
    """

    response = client.turns.delete_turn(solo_turn_id)
    assert_status(response, HttpStatus.NO_CONTENT)


def test_turn_no_longer_accessible(client: ApiClient, solo_turn_id: int) -> None:
    """
    Deleted turn returns 404 on GET.
    """

    client.turns.delete_turn(solo_turn_id)
    response = client.turns.get_turn(solo_turn_id)

    assert_body(response, TURN_NOT_FOUND)
    assert_status(response, HttpStatus.NOT_FOUND)


def test_status_on_unknown_turn(client: ApiClient) -> None:
    """
    Unknown turn returns 404.
    """

    response = client.turns.delete_turn(NON_EXISTENT_ID)

    assert_body(response, TURN_NOT_FOUND)
    assert_status(response, HttpStatus.NOT_FOUND)


def test_in_service_client_restored_to_at_barbershop(
    client: ApiClient, open_barbershop_id: int, active_barber_id: int
) -> None:
    """
    Deleting an `in_service` client's turn restores their status to
    `at_barbershop`.
    """

    client_id = checked_in(client, open_barbershop_id)
    turn_id = create_solo_turn(client, open_barbershop_id, active_barber_id, client_id)
    client.turns.delete_turn(turn_id)

    clients_response = client.barbershops.get_clients(open_barbershop_id)
    assert any(client_id == client["clientId"] for client in clients_response.json())


def test_on_queue_client_restored_to_at_barbershop(
    client: ApiClient, open_barbershop_id: int, active_barber_id: int
) -> None:
    """
    Deleting an `on_queue` client's turn restores their status to
    `at_barbershop`.
    """

    first_client_id = checked_in(client, open_barbershop_id)
    second_client_id = checked_in(client, open_barbershop_id)

    first_turn_id = create_solo_turn(
        client, open_barbershop_id, active_barber_id, first_client_id
    )
    second_turn_id = create_solo_turn(
        client, open_barbershop_id, active_barber_id, second_client_id
    )
    client.turns.delete_turn(second_turn_id)

    clients_response = client.barbershops.get_clients(open_barbershop_id)
    assert any(
        second_client_id == client["clientId"] for client in clients_response.json()
    )

    client.turns.delete_turn(first_turn_id)


def test_group_leader_deletion_cancels_entire_group(
    client: ApiClient, group_turn: GroupTurnData
) -> None:
    """
    Deleting a group leader's turn removes all member turns
    too.
    """

    client.turns.delete_turn(group_turn.leader_turn_id)

    for member_turn_id in group_turn.member_turn_ids:
        response = client.turns.get_turn(member_turn_id)
        assert_status(response, HttpStatus.NOT_FOUND)


def test_group_leader_deletion_restores_leader_status(
    client: ApiClient, open_barbershop_id: int, group_turn: GroupTurnData
) -> None:
    """
    After group cancellation, leader is back in the barbershop presence list.
    """

    leader_id = group_turn.leader_id
    client.turns.delete_turn(group_turn.leader_turn_id)

    clients_response = client.barbershops.get_clients(open_barbershop_id)
    assert any(leader_id == client["clientId"] for client in clients_response.json())


def test_member_turn_deletion_does_not_cancel_leader(
    client: ApiClient, group_turn: GroupTurnData
) -> None:
    """
    Deleting one member's turn leaves the leader's turn intact.
    """

    client.turns.delete_turn(group_turn.member_turn_ids[0])

    response = client.turns.get_turn(group_turn.leader_turn_id)
    assert_status(response, HttpStatus.OK)


def test_member_turn_deletion_removes_only_that_member(
    client: ApiClient, group_turn: GroupTurnData
) -> None:
    """
    Deleting one member does not affect other members.
    """

    turn_a, turn_b = group_turn.member_turn_ids
    client.turns.delete_turn(turn_a)

    # Turn b still exists
    response = client.turns.get_turn(turn_b)
    assert_status(response, HttpStatus.OK)


def test_next_on_queue_turn_promoted_after_deletion(client: ApiClient) -> None:
    """
    After deleting an `in_service` turn, the next `on_queue` turn
    is promoted.
    """

    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)

    client_a = checked_in(client, barbershop_id)
    client_b = checked_in(client, barbershop_id)

    turn_a_id = create_solo_turn(client, barbershop_id, barber_id, client_a)
    turn_b_id = create_solo_turn(client, barbershop_id, barber_id, client_b)

    turn_b_response = client.turns.get_turn(turn_b_id)
    assert turn_b_response.json()["ownerStatus"] == ClientStatusEnum.ON_QUEUE

    # Delete turn A
    client.turns.delete_turn(turn_a_id)

    # Client B should now be in_service
    turn_b_response = client.turns.get_turn(turn_b_id)
    assert turn_b_response.json()["ownerStatus"] == ClientStatusEnum.IN_SERVICE
