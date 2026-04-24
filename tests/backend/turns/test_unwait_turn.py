"""
Tests for PATCH /api/turns/{id}/unwait
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

_CLIENT_CANNOT_BE_ON_QUEUE = ErrorResponse(
    error="Only 'waiting' clients can be set back to 'on_queue'"
)


def _get_waiting_turn_id(client: ApiClient, barbershop_id: int, barber_id: int) -> int:
    first_client_id = checked_in(client, barbershop_id)
    second_client_id = checked_in(client, barbershop_id)

    create_solo_turn(client, barbershop_id, barber_id, first_client_id)
    second_turn_id = create_solo_turn(
        client, barbershop_id, barber_id, second_client_id
    )

    client.turns.wait_turn(second_turn_id)
    return second_turn_id


@pytest.fixture(scope="module")
def waiting_turn_id(client: ApiClient) -> int:
    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)
    return _get_waiting_turn_id(client, barbershop_id, barber_id)


@pytest.fixture(scope="module")
def response(client: ApiClient, waiting_turn_id: int) -> requests.Response:
    return client.turns.unwait_turn(waiting_turn_id)


def test_status(response: requests.Response) -> None:
    """
    Successful unwait returns 200.
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


def test_valid_turn_state(response: requests.Response) -> None:
    """
    Turn has a valid state after being marked as waiting.
    """

    turn = TurnDetailResponse.from_response(response)
    assert turn.owner_status == ClientStatusEnum.ON_QUEUE
    assert turn.position is not None and turn.position >= 1


def test_position_preserved_after_unwait(
    client: ApiClient, waiting_turn_id: int
) -> None:
    """
    Turn regains its original relative position after unwait.
    """

    response = client.turns.get_turn(waiting_turn_id)
    turn = TurnDetailResponse.from_response(response)
    assert turn.position == 2


def test_status_on_unknown_turn(client: ApiClient) -> None:
    """
    Unknown turn returns 404.
    """

    response = client.turns.unwait_turn(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, TURN_NOT_FOUND)


def test_on_queue_turn_cannot_unwait(client: ApiClient) -> None:
    """
    Calling unwait on an `on_queue` turn returns 422.
    """

    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)

    first_client_id = checked_in(client, barbershop_id)
    second_client_id = checked_in(client, barbershop_id)

    create_solo_turn(client, barbershop_id, barber_id, first_client_id)
    second_turn_id = create_solo_turn(
        client, barbershop_id, barber_id, second_client_id
    )

    response = client.turns.unwait_turn(second_turn_id)

    assert_status(response, HttpStatus.FORBIDDEN)
    assert_body(response, _CLIENT_CANNOT_BE_ON_QUEUE)


def test_unwait_at_position_1_promotes_to_in_service(client: ApiClient) -> None:
    """
    Unwait a turn that lands at position 1 with no one `in_service`
    promotes it directly to `in_service`.
    """

    barbershop_id = get_open_barbershop_id(client)
    barber_id = get_active_barber_id(client, barbershop_id)

    first_client_id = checked_in(client, barbershop_id)
    second_client_id = checked_in(client, barbershop_id)

    first_turn_id = create_solo_turn(client, barbershop_id, barber_id, first_client_id)
    second_turn_id = create_solo_turn(
        client, barbershop_id, barber_id, second_client_id
    )

    response = client.turns.wait_turn(second_turn_id)
    turn = TurnDetailResponse.from_response(response)
    assert turn.owner_status == ClientStatusEnum.WAITING

    client.turns.delete_turn(first_turn_id)
    response = client.turns.unwait_turn(second_turn_id)
    turn = TurnDetailResponse.from_response(response)

    assert_status(response, HttpStatus.OK)
    assert turn.owner_status == ClientStatusEnum.IN_SERVICE
