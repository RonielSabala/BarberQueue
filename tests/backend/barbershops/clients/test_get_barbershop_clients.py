"""
Tests for GET /api/barbershops/{id}/clients
"""

import pytest
import requests

from api.client import ApiClient
from api.core import HttpHeader, HttpStatus
from backend.barbershops.clients.conftest import get_fresh_client_id
from backend.conftest import NON_EXISTENT_ID
from domain.dtos.barbershops import BarbershopClientResponse
from domain.enums import ClientStatusEnum
from helpers.assertions import (
    assert_body,
    assert_content_type,
    assert_list_body_shape,
    assert_status,
)
from helpers.common_responses import BARBERSHOP_NOT_FOUND


@pytest.fixture(scope="module")
def checked_in_client_id(client: ApiClient, open_barbershop_id: int) -> int:
    client_id = get_fresh_client_id(client)
    client.barbershops.check_in(open_barbershop_id, client_id)
    return client_id


@pytest.fixture(scope="module")
def response(
    client: ApiClient, open_barbershop_id: int, checked_in_client_id: int
) -> requests.Response:
    return client.barbershops.get_clients(open_barbershop_id)


def test_status(response: requests.Response) -> None:
    """
    Successful client list returns 200.
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

    assert_list_body_shape(response, BarbershopClientResponse)


def test_status_on_unknown_barbershop(client: ApiClient) -> None:
    """
    Unknown barbershop returns 404.
    """

    response = client.barbershops.get_clients(NON_EXISTENT_ID)

    assert_status(response, HttpStatus.NOT_FOUND)
    assert_body(response, BARBERSHOP_NOT_FOUND)


def test_checked_in_client_appears(
    response: requests.Response, checked_in_client_id: int
) -> None:
    """
    A checked-in client appears in the list.
    """

    assert any(checked_in_client_id == client["clientId"] for client in response.json())


def test_all_clients_have_at_barbershop_status(response: requests.Response) -> None:
    """
    All returned clients have currentStatus='at_barbershop'.
    """

    assert all(
        client["currentStatus"] == ClientStatusEnum.AT_BARBERSHOP
        for client in response.json()
    )
