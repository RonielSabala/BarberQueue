import requests

from http_header import HttpHeader
from http_status import HttpStatus

EXPECTED_BODY = {"error": "Route not found"}


def _get_response(base_url: str) -> requests.Response:
    """
    Return a api URL that is guaranteed not to exist.
    """

    url = f"{base_url}/api/this-route-does-not-exist"
    return requests.get(url, timeout=5)


def test_invalid_route_status(base_url: str) -> None:
    """
    Unknown routes return 404.
    """

    response = _get_response(base_url)
    assert response.status_code == HttpStatus.NOT_FOUND


def test_invalid_route_body(base_url: str) -> None:
    """
    Unknown routes return a structured JSON error.
    """

    response = _get_response(base_url)
    assert response.json() == EXPECTED_BODY


def test_invalid_route_content_type(base_url: str) -> None:
    """
    Unknown routes return JSON content type.
    """

    response = _get_response(base_url)
    assert response.headers.get("Content-Type") == HttpHeader.JSON.with_charset
