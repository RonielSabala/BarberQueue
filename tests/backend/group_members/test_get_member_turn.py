"""
Tests for GET /api/group-members/{id}/turn
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.conftest import NON_EXISTENT_ID
from domain.dtos import ErrorResponse
from domain.dtos.group_members import GroupMemberTurnResponse
from helpers.assertions import (
    assert_body,
    assert_body_shape,
    assert_content_type,
    assert_status,
)

SEEDED_ACTIVE_MEMBER_ID = 3
SEEDED_INACTIVE_MEMBER_ID = 1

_MEMBER_NOT_FOUND = ErrorResponse(error="Member not found")
_NO_ACTIVE_TURN = ErrorResponse(error="No active turn found for this group member")


@pytest.fixture(scope="module")
def response(client: ApiClient) -> requests.Response:
    return client.group_members.get_turn(SEEDED_ACTIVE_MEMBER_ID)


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

    assert response.json()["position"] >= 1


def test_group_id_is_present(response: requests.Response) -> None:
    """
    Response includes the groupId the member belongs to.
    """

    assert response.json()["groupId"] is not None


def test_status_on_unknown_member(client: ApiClient) -> None:
    """
    Unknown member returns 404.
    """

    response = client.group_members.get_turn(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _MEMBER_NOT_FOUND)


def test_member_with_no_active_turn(client: ApiClient) -> None:
    """
    Member with no active turn returns 404.
    """

    response = client.group_members.get_turn(SEEDED_INACTIVE_MEMBER_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, _NO_ACTIVE_TURN)
