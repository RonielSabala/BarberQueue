"""
Tests for PATCH /api/turns/{id}/pay
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
    get_active_barber_id,
    get_open_barbershop_id,
)
from domain.dtos import ErrorResponse
from domain.dtos.turns import TurnDetailResponse
from domain.enums import ClientStatusEnum, OwnerTypeEnum
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import TURN_NOT_FOUND

_NOT_ATTENDED = ErrorResponse(error="Client must have status 'attended' to pay")
_MEMBER_CANNOT_PAY = ErrorResponse(
    error="Member turns cannot be paid independently. The group leader must pay"
)
_GROUP_NOT_ALL_ATTENDED = ErrorResponse(
    error="All group members must have status 'attended' before the group can pay"
)


def _attend_turn(client: ApiClient, turn_id: int) -> None:
    response = client.turns.attend_turn(turn_id)
    assert response.status_code == HttpStatus.OK


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)

    client_id = checked_in(client, barbershop_id)
    turn_id = create_solo_turn(client, barbershop_id, barber_id, client_id)

    _attend_turn(client, turn_id)
    return client.turns.pay_turn(turn_id)


def test_status(response: requests.Response) -> None:
    """
    Successful pay returns 200.
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

    assert_body_shape(response, TurnDetailResponse)


def test_status_becomes_paid(response: requests.Response) -> None:
    """
    Turn status becomes paid.
    """

    assert response.json()["ownerStatus"] == ClientStatusEnum.PAID


def test_position_is_null_after_pay(response: requests.Response) -> None:
    """
    Paid turns have no queue position.
    """

    assert response.json()["position"] is None


def test_status_on_unknown_turn(client: ApiClient) -> None:
    """
    Unknown turn returns 404.
    """

    response = client.turns.pay_turn(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, TURN_NOT_FOUND)


def test_on_queue_client_cannot_pay(client: ApiClient) -> None:
    """
    `on_queue` client returns 422.
    """

    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)

    client_a = checked_in(client, barbershop_id)
    client_b = checked_in(client, barbershop_id)

    create_solo_turn(client, barbershop_id, barber_id, client_a)
    turn_b_id = create_solo_turn(client, barbershop_id, barber_id, client_b)

    turn_b_response = client.turns.get_turn(turn_b_id)
    assert turn_b_response.json()["ownerStatus"] == ClientStatusEnum.ON_QUEUE

    response = client.turns.pay_turn(turn_b_id)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _NOT_ATTENDED)


def test_member_turn_cannot_pay(client: ApiClient) -> None:
    """
    Member turn returns 422. Only the group leader can pay.
    """

    barbershop_id = get_open_barbershop_id(client)

    leader_id = checked_in(client, barbershop_id)
    turns = create_group_turn(client, barbershop_id, leader_id, ["member1"])

    member_turn = next(
        turn for turn in turns if turn["ownerType"] == OwnerTypeEnum.MEMBER
    )
    response = client.turns.pay_turn(member_turn["id"])

    assert_body(response, _MEMBER_CANNOT_PAY)
    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)


def test_group_pay_succeeds_when_all_attended(client: ApiClient) -> None:
    """
    Group leader can pay once all members are attended.
    """

    barbershop_id = get_open_barbershop_id(client)
    get_active_barber_id(client, barbershop_id)

    leader_id = checked_in(client, barbershop_id)
    turns = create_group_turn(client, barbershop_id, leader_id, ["member1"])

    leader_turn_id = next(
        turn for turn in turns if turn["ownerType"] == OwnerTypeEnum.CLIENT
    )["id"]
    member_turn_id = next(
        turn for turn in turns if turn["ownerType"] == OwnerTypeEnum.MEMBER
    )["id"]

    # Attend both
    _attend_turn(client, leader_turn_id)
    _attend_turn(client, member_turn_id)

    response = client.turns.pay_turn(leader_turn_id)

    # Successful pay
    assert_status(response, HttpStatus.OK)
    assert response.json()["ownerStatus"] == ClientStatusEnum.PAID

    # Both turns should now be absent from the barbershop queue
    queue_response = client.queues.get_barbershop_queues(barbershop_id)
    all_turn_ids = set(
        turns["id"] for barber in queue_response.json() for turns in barber["turns"]
    )

    assert leader_turn_id not in all_turn_ids
    assert member_turn_id not in all_turn_ids


def test_group_pay_fails_if_member_not_attended(client: ApiClient) -> None:
    """
    Group leader cannot pay while any member is not yet attended.
    """

    barbershop_id = get_open_barbershop_id(client)
    get_active_barber_id(client, barbershop_id)

    leader_id = checked_in(client, barbershop_id)
    turns = create_group_turn(client, barbershop_id, leader_id, ["member1"])

    leader_turn_id = (
        next(turn for turn in turns if turn["ownerType"] == OwnerTypeEnum.CLIENT)
    )["id"]

    # Only attend the leader, leave member as-is
    _attend_turn(client, leader_turn_id)
    response = client.turns.pay_turn(leader_turn_id)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _GROUP_NOT_ALL_ATTENDED)
