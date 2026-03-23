"""
Auto-generated validation tests for all every `POST`/`PUT`/`PATCH`
body request on missing fields and wrong types.
"""

import pytest

from api.client import ApiClient
from api.core import HttpStatus
from domain.dtos import ErrorResponse
from helpers.assertions import assert_body, assert_status
from helpers.requests_testing import BadFieldCase, missing_field_cases, nested_case_id
from helpers.route_discovery import BodyRoute, discover_body_routes

_CASES = {
    nested_case_id(route.method_name, case.case_id): (route, case)
    for route in discover_body_routes()
    for case in missing_field_cases(route.request_class)
}


@pytest.mark.parametrize("route,case", _CASES.values(), ids=_CASES.keys())
def test_field_validation(
    client: ApiClient, route: BodyRoute, case: BadFieldCase
) -> None:
    """
    Response contains a specific error message when missing or
    of the wrong type.
    """

    response = client.request(route.http_method, route.full_path, body=case.payload)
    expected_response = ErrorResponse(error=case.expected_error_msg)
    assert_status(response, HttpStatus.BAD_REQUEST)
    assert_body(response, expected_response)
