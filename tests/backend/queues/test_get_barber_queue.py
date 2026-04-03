"""
Tests for GET /api/queues/barber/{barberId}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID, get_fresh_client_id
from domain.dtos.queues import QueueResponse
from domain.enums import OwnerTypeEnum
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import BARBER_NOT_FOUND

SEEDED_BARBER_ID = 4


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    return client.queues.get_barber_queue(SEEDED_BARBER_ID)


def test_status(response: requests.Response) -> None:
    """
    Successful barber queue returns 200.
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

    assert_body_shape(response, QueueResponse)


def test_positions_are_sequential(response: requests.Response) -> None:
    """
    Turns have sequential positions starting at 1.
    """

    turns = response.json()["turns"]
    positions = [turn["position"] for turn in turns]
    assert positions == list(range(1, len(positions) + 1))


def test_all_turns_owner_type(response: requests.Response) -> None:
    """
    Every turn ownerType is a client or a member.
    """

    for turn in response.json()["turns"]:
        assert turn["ownerType"] in (OwnerTypeEnum.CLIENT, OwnerTypeEnum.MEMBER)


def test_status_on_unknown_barber(client: ApiClient) -> None:
    """
    Unknown barber returns 404.
    """

    response = client.queues.get_barber_queue(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)


def test_status_on_non_barber_user(client: ApiClient) -> None:
    """
    Requesting a non-barber user returns 404.
    """

    client_id = get_fresh_client_id(client)
    response = client.queues.get_barber_queue(client_id)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBER_NOT_FOUND)
