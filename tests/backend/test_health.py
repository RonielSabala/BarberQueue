import requests

from http_header import HttpHeader
from http_status import HttpStatus

EXPECTED_BODY = {"message": "OK"}


def _get_response(base_url: str) -> requests.Response:
    """
    Return the health api response from `base_url`.
    """

    url = f"{base_url}/api/health"
    return requests.get(url, timeout=5)


def test_health_status(base_url: str) -> None:
    """
    Health endpoint returns 200.
    """

    response = _get_response(base_url)
    assert response.status_code == HttpStatus.OK


def test_health_body(base_url: str) -> None:
    """
    Health endpoint body matches expected payload.
    """

    response = _get_response(base_url)
    assert response.json() == EXPECTED_BODY


def test_health_content_type(base_url: str) -> None:
    """
    Health endpoint returns plain text content type.
    """

    response = _get_response(base_url)
    assert response.headers.get("Content-Type") == HttpHeader.PLAIN_TEXT.with_charset
