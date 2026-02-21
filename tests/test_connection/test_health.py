import requests

from http_header import HttpHeader
from http_status import HttpStatus

EXPECTED_RESPONSE = {"message": "OK"}


def _get_url(base_url: str) -> str:
    """
    Return the health api url from `base_url`.
    """

    return f"{base_url}/api/health"


def test_health_endpoint(base_url: str):
    """
    Assert that the server replies with a 200. Ensure the
    body contains the expected text and the content type
    is plain text.
    """

    url = _get_url(base_url)
    response = requests.get(url, timeout=5)

    assert response.status_code == HttpStatus.OK, f"status {response.status_code}"

    body = response.text
    assert body == str(EXPECTED_RESPONSE), f"unexpected body: {body!r}"

    content_type = response.headers.get("Content-Type")
    assert content_type == HttpHeader.PLAIN_TEXT.content_type
