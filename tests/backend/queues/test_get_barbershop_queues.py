"""
Tests for GET /api/queues/barbershop/{barbershopId}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos.queues import QueueResponse
from domain.enums import OwnerTypeEnum
from helpers.assertions import (
    assert_body,
    assert_content_type,
    assert_list_body_shape,
    assert_status,
)
from helpers.common_responses import BARBERSHOP_NOT_FOUND

SEEDED_BARBER_ID = 8
SEEDED_BARBERSHOP_ID = 1


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    return client.queues.get_barbershop_queues(SEEDED_BARBERSHOP_ID)


def test_status(response: requests.Response) -> None:
    """
    Successful barbershop queue returns 200.
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

    assert_list_body_shape(response, QueueResponse)


def test_seeded_barber_appears(response: requests.Response) -> None:
    """
    The seeded active barber appears in the queue.
    """

    assert any(SEEDED_BARBER_ID == barber["barberId"] for barber in response.json())


def test_positions_are_sequential(response: requests.Response) -> None:
    """
    Turns within each barber queue have sequential positions starting at 1.
    """

    for barber in response.json():
        positions = [turn["position"] for turn in barber["turns"]]
        assert positions == list(range(1, len(positions) + 1))


def test_all_turns_have_positive_position(response: requests.Response) -> None:
    """
    All turns in any barber queue have a non-zero position.
    """

    for barber in response.json():
        for turn in barber["turns"]:
            assert turn["position"] >= 1


def test_all_turns_owner_type_is_valid(response: requests.Response) -> None:
    """
    Every turn ownerType is client or member.
    """

    for barber in response.json():
        for turn in barber["turns"]:
            assert turn["ownerType"] in (OwnerTypeEnum.CLIENT, OwnerTypeEnum.MEMBER)


def test_live_turn_appears_in_barber_queue(
    client: ApiClient, open_barbershop_id: int, active_barber_id: int, live_turn: dict
) -> None:
    """
    A turn created via POST appears in the barbershop queue under the
    correct barber.
    """

    response = client.queues.get_barbershop_queues(open_barbershop_id)

    live_turn_id = live_turn["turn_id"]
    barber_queue = next(
        (
            barber
            for barber in response.json()
            if active_barber_id == barber["barberId"]
        ),
        None,
    )

    assert_status(response, HttpStatus.OK)
    assert barber_queue is not None
    assert any(live_turn_id == turn["id"] for turn in barber_queue["turns"])


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    response = client.queues.get_barbershop_queues(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)
