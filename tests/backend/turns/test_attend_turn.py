"""
Tests for PATCH /api/turns/{id}/attend
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

_NOT_IN_SERVICE = ErrorResponse(error="Only 'in_service' turns can be attended")


def _get_in_service_turn_id(
    client: ApiClient, barbershop_id: int, barber_id: int
) -> int:
    client_id = checked_in(client, barbershop_id)
    return create_solo_turn(client, barbershop_id, barber_id, client_id)


@pytest.fixture(scope="module")
def in_service_turn_id(client: ApiClient) -> int:
    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)
    return _get_in_service_turn_id(client, barbershop_id, barber_id)


@pytest.fixture(scope="module")
def response(client: ApiClient, in_service_turn_id: int) -> requests.Response:
    return client.turns.attend_turn(in_service_turn_id)


def test_status(response: requests.Response) -> None:
    """
    Successful attend returns 200.
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


def test_status_becomes_attended(response: requests.Response) -> None:
    """
    Turn status becomes attended.
    """

    assert response.json()["ownerStatus"] == ClientStatusEnum.ATTENDED


def test_position_is_null_after_attend(response: requests.Response) -> None:
    """
    Attended turns have no queue position.
    """

    assert response.json()["position"] is None


def test_status_on_unknown_turn(client: ApiClient) -> None:
    """
    Unknown turn returns 404.
    """

    response = client.turns.attend_turn(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, TURN_NOT_FOUND)


def test_next_on_queue_turn_promoted(client: ApiClient) -> None:
    """
    After attending, the next `on_queue` turn in the barber's
    queue becomes `in_service`.
    """

    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)

    client_a = checked_in(client, barbershop_id)
    client_b = checked_in(client, barbershop_id)

    turn_a_id = create_solo_turn(client, barbershop_id, barber_id, client_a)
    turn_b_id = create_solo_turn(client, barbershop_id, barber_id, client_b)

    turn_b_response = client.turns.get_turn(turn_b_id)
    assert turn_b_response.json()["ownerStatus"] == ClientStatusEnum.ON_QUEUE

    client.turns.attend_turn(turn_a_id)
    turn_b_response = client.turns.get_turn(turn_b_id)
    assert turn_b_response.json()["ownerStatus"] == ClientStatusEnum.IN_SERVICE


def test_waiting_turn_skipped_on_promotion(client: ApiClient) -> None:
    """
    After attending, a `waiting` turn at position 1 is skipped and
    the next `on_queue` turn is promoted instead.
    """

    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)

    client_a = checked_in(client, barbershop_id)
    client_b = checked_in(client, barbershop_id)
    client_c = checked_in(client, barbershop_id)

    turn_a_id = create_solo_turn(client, barbershop_id, barber_id, client_a)
    turn_b_id = create_solo_turn(client, barbershop_id, barber_id, client_b)
    turn_c_id = create_solo_turn(client, barbershop_id, barber_id, client_c)

    # B goes waiting
    client.turns.wait_turn(turn_b_id)
    turn_b_response = client.turns.get_turn(turn_b_id)
    assert turn_b_response.json()["ownerStatus"] == ClientStatusEnum.WAITING

    # Attend A, B is waiting so C should be promoted
    client.turns.attend_turn(turn_a_id)

    turn_b_response = client.turns.get_turn(turn_b_id)
    turn_c_response = client.turns.get_turn(turn_c_id)

    assert turn_b_response.json()["ownerStatus"] == ClientStatusEnum.WAITING
    assert turn_c_response.json()["ownerStatus"] == ClientStatusEnum.IN_SERVICE


def test_on_queue_turn_cannot_be_attended(client: ApiClient) -> None:
    """
    `on_queue` turn returns 422.
    """

    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)

    client_a = checked_in(client, barbershop_id)
    client_b = checked_in(client, barbershop_id)

    create_solo_turn(client, barbershop_id, barber_id, client_a)
    turn_b_id = create_solo_turn(client, barbershop_id, barber_id, client_b)

    turn_b_response = client.turns.get_turn(turn_b_id)
    assert turn_b_response.json()["ownerStatus"] == ClientStatusEnum.ON_QUEUE

    response = client.turns.attend_turn(turn_b_id)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _NOT_IN_SERVICE)


def test_member_turn_can_be_attended(client: ApiClient) -> None:
    """
    A group member's turn can also be attended when in_service.
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

    client.turns.attend_turn(leader_turn_id)
    response = client.turns.attend_turn(member_turn_id)

    assert response.json()["ownerStatus"] == ClientStatusEnum.ATTENDED
