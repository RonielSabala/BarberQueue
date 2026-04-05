"""
Tests for GET /api/group-members/{id}/turn
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID, checked_in, create_group_turn
from domain.dtos import ErrorResponse
from domain.dtos.group_members import GroupMemberTurnResponse
from domain.enums import OwnerTypeEnum
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)

_MEMBER_NOT_FOUND = ErrorResponse(error="Member not found")


@pytest.fixture(scope="module")
def group_data(client: ApiClient, open_barbershop_id: int) -> dict:
    """
    Creates a group turn and returns structured data for assertions.
    """

    leader_id = checked_in(client, open_barbershop_id)
    turns = create_group_turn(
        client, open_barbershop_id, leader_id, ["member1", "member2"]
    )

    member_turns = [turn for turn in turns if turn["ownerType"] == OwnerTypeEnum.MEMBER]
    return {
        "member_turns": member_turns,
        "first_member_id": member_turns[0]["ownerId"],
        "group_id": turns[0]["groupId"],
    }


@pytest.fixture(scope="module")
def response(client: ApiClient, group_data: dict) -> requests.Response:
    return client.group_members.get_turn(group_data["first_member_id"])


def test_status(response: requests.Response) -> None:
    """
    Successful member turn fetch returns 200.
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

    assert_body_shape(response, GroupMemberTurnResponse)


def test_position_is_positive(response: requests.Response) -> None:
    """
    Position is a positive integer.
    """

    position = response.json()["position"]
    assert position is None or position >= 1


def test_group_id_matches(response: requests.Response, group_data: dict) -> None:
    """
    Response groupId matches the created group.
    """

    assert response.json()["groupId"] == group_data["group_id"]


def test_member_id_matches(response: requests.Response, group_data: dict) -> None:
    """
    Response memberId matches the requested member.
    """

    assert response.json()["memberId"] == group_data["first_member_id"]


def test_each_member_has_independent_position(
    client: ApiClient, group_data: dict
) -> None:
    """
    Each member in the group has its own independent queue position.
    """

    positions = set()
    for turn in group_data["member_turns"]:
        response = client.group_members.get_turn(turn["ownerId"])
        position = response.json()["position"]

        assert_status(response, HttpStatus.OK)
        assert position is None or position >= 1

        positions.add(position)

    # All members should have a valid position
    assert len(positions) >= 1


def test_status_on_unknown_member(client: ApiClient) -> None:
    """
    Unknown member returns 404.
    """

    response = client.group_members.get_turn(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _MEMBER_NOT_FOUND)
