"""
Tests for GET /api/turns/{id}
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID, checked_in, create_solo_turn
from domain.dtos.turns import TurnDetailResponse
from domain.enums import OwnerTypeEnum
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)
from helpers.common_responses import TURN_NOT_FOUND


@pytest.fixture(scope="module")
def turn_id(client: ApiClient, open_barbershop_id: int, active_barber_id: int) -> int:
    client_id = checked_in(client, open_barbershop_id)
    return create_solo_turn(client, open_barbershop_id, active_barber_id, client_id)


@pytest.fixture(scope="module")
def response(client: ApiClient, turn_id: int) -> requests.Response:
    return client.turns.get_turn(turn_id)


def test_status(response: requests.Response) -> None:
    """
    Successful turn fetch returns 200.
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


def test_id_matches(response: requests.Response, turn_id: int) -> None:
    """
    Response id matches the requested turn.
    """

    assert response.json()["id"] == turn_id


def test_owner_type_is_valid(response: requests.Response) -> None:
    """
    ownerType is either 'client' or 'member'.
    """

    assert response.json()["ownerType"] in (OwnerTypeEnum.CLIENT, OwnerTypeEnum.MEMBER)


def test_position_is_positive(response: requests.Response) -> None:
    """
    Position is a positive integer.
    """

    assert response.json()["position"] >= 1


def test_status_on_unknown_turn(client: ApiClient) -> None:
    """
    Unknown turn returns 404.
    """

    response = client.turns.get_turn(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, TURN_NOT_FOUND)
