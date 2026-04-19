"""
Tests for PATCH /api/turns/{id}/wait
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import (
    NON_EXISTENT_ID,
    checked_in,
    create_solo_turn,
    get_active_barber_id,
    get_open_barbershop_id,
)
from domain.dtos import ErrorResponse
from domain.dtos.turns import TurnDetailResponse
from domain.enums import ClientStatusEnum
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import TURN_NOT_FOUND

_NOT_ON_QUEUE = ErrorResponse(error="Only 'on_queue' turns can be set to 'waiting'")


@pytest.fixture(scope="module")
def on_queue_turn_id(
    client: ApiClient, open_barbershop_id: int, active_barber_id: int
) -> int:
    first_client_id = checked_in(client, open_barbershop_id)
    second_client_id = checked_in(client, open_barbershop_id)

    create_solo_turn(client, open_barbershop_id, active_barber_id, first_client_id)
    second_turn_id = create_solo_turn(
        client, open_barbershop_id, active_barber_id, second_client_id
    )

    return second_turn_id


@pytest.fixture(scope="module")
def response(client: ApiClient, on_queue_turn_id: int) -> requests.Response:
    return client.turns.wait_turn(on_queue_turn_id)


def test_status(response: requests.Response) -> None:
    """
    Successful wait returns 200.
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


def test_status_becomes_waiting(response: requests.Response) -> None:
    """
    Turn status becomes waiting.
    """

    turn = TurnDetailResponse.from_response(response)
    assert turn.owner_status == ClientStatusEnum.WAITING


def test_turn_preserves_position(client: ApiClient, on_queue_turn_id: int) -> None:
    """
    Turn remains in the queue after waiting.
    """

    response = client.turns.get_turn(on_queue_turn_id)
    turn = TurnDetailResponse.from_response(response)
    assert turn.position is not None


def test_status_on_unknown_turn(client: ApiClient) -> None:
    """
    Unknown turn returns 404.
    """

    response = client.turns.wait_turn(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, TURN_NOT_FOUND)


def test_already_waiting_returns_unprocessable(
    client: ApiClient, on_queue_turn_id: int
) -> None:
    """
    Calling wait on an already `waiting` turn returns 422.
    """

    response = client.turns.wait_turn(on_queue_turn_id)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _NOT_ON_QUEUE)


def test_in_service_turn_cannot_wait(client: ApiClient) -> None:
    """
    `in_service` turn cannot be set to waiting.
    """

    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)

    client_id = checked_in(client, barbershop_id)
    turn_id = create_solo_turn(client, barbershop_id, barber_id, client_id)

    response = client.turns.wait_turn(turn_id)

    assert_status(response, HttpStatus.UNPROCESSABLE_ENTITY)
    assert_body(response, _NOT_ON_QUEUE)


def test_next_on_queue_turn_promoted_when_waiting_reaches_position_1(
    client: ApiClient,
) -> None:
    """
    When a position-1 `on_queue` turn is set to `waiting`, the
    next `on_queue` turn behind it is promoted to `in_service`.
    """

    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)

    client_a = checked_in(client, barbershop_id)
    client_b = checked_in(client, barbershop_id)
    client_c = checked_in(client, barbershop_id)

    turn_a_id = create_solo_turn(client, barbershop_id, barber_id, client_a)
    turn_b_id = create_solo_turn(client, barbershop_id, barber_id, client_b)
    turn_c_id = create_solo_turn(client, barbershop_id, barber_id, client_c)

    # Delete A so B gets promoted
    client.turns.delete_turn(turn_a_id)
    turn_b_response = client.turns.get_turn(turn_b_id)
    turn_b = TurnDetailResponse.from_response(turn_b_response)
    assert turn_b.owner_status == ClientStatusEnum.IN_SERVICE

    # Delete B so C gets promoted
    client.turns.delete_turn(turn_b_id)
    turn_c_response = client.turns.get_turn(turn_c_id)
    turn_c = TurnDetailResponse.from_response(turn_c_response)
    assert turn_c.owner_status == ClientStatusEnum.IN_SERVICE

    # Add client D
    client_d = checked_in(client, barbershop_id)
    turn_d_id = create_solo_turn(client, barbershop_id, barber_id, client_d)
    turn_d_response = client.turns.get_turn(turn_d_id)
    turn_d = TurnDetailResponse.from_response(turn_d_response)
    assert turn_d.owner_status == ClientStatusEnum.ON_QUEUE

    # Clean setup

    client.turns.delete_turn(turn_c_id)
    client.turns.delete_turn(turn_d_id)

    # Two on_queue turns

    fresh_a = checked_in(client, barbershop_id)
    fresh_b = checked_in(client, barbershop_id)
    fresh_c = checked_in(client, barbershop_id)

    turn_fresh_a_id = create_solo_turn(client, barbershop_id, barber_id, fresh_a)
    turn_fresh_b_id = create_solo_turn(client, barbershop_id, barber_id, fresh_b)
    turn_fresh_c_id = create_solo_turn(client, barbershop_id, barber_id, fresh_c)

    # Wait fresh_b
    client.turns.wait_turn(turn_fresh_b_id)
    fresh_turn_b_response = client.turns.get_turn(turn_fresh_b_id)
    fresh_turn_b = TurnDetailResponse.from_response(fresh_turn_b_response)
    assert fresh_turn_b.owner_status == ClientStatusEnum.WAITING

    # Delete fresh_a so fresh_c gets promoted
    client.turns.delete_turn(turn_fresh_a_id)
    fresh_turn_c_response = client.turns.get_turn(turn_fresh_c_id)
    fresh_turn_c = TurnDetailResponse.from_response(fresh_turn_c_response)
    assert fresh_turn_c.owner_status == ClientStatusEnum.IN_SERVICE

    # Clean up
    client.turns.delete_turn(turn_fresh_b_id)
    client.turns.delete_turn(turn_fresh_c_id)
