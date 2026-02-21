import requests

from http_header import HttpHeader
from http_status import HttpStatus

EXPECTED_RESPONSE = {"error": "Route not found"}


def _get_url(base_url: str) -> str:
    """
    Return a api URL that is guaranteed not to exist.
    """

    return f"{base_url}/api/this-route-does-not-exist"


def test_invalid_route_endpoint(base_url: str):
    """
    Assert that the server replies with a `HttpStatus.NOT_FOUND`.
    """

    url = _get_url(base_url)
    response = requests.get(url, timeout=5)

    assert response.status_code == HttpStatus.NOT_FOUND, (
        f"status {response.status_code}"
    )

    body = response.text
    assert body == str(EXPECTED_RESPONSE), f"alert message missing: {body!r}"

    content_type = response.headers.get("Content-Type")
    assert content_type == HttpHeader.HTML_TEXT.content_type
