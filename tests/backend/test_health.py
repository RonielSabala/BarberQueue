from api.client import ApiClient
from http_header import HttpHeader
from http_method import HttpMethod
from http_status import HttpStatus

EXPECTED_BODY = {"message": "OK"}


class TestHealth:
    """
    Tests for GET /api/health.
    """

    BASE = "/api/health"

    def test_status(self, client: ApiClient) -> None:
        """
        Health endpoint returns 200.
        """

        response = client.request(HttpMethod.GET, self.BASE)
        assert response.status_code == HttpStatus.OK

    def test_body(self, client: ApiClient) -> None:
        """
        Health endpoint body matches expected payload.
        """

        response = client.request(HttpMethod.GET, self.BASE)
        assert response.json() == EXPECTED_BODY

    def test_content_type(self, client: ApiClient) -> None:
        """
        Health endpoint returns plain text content type.
        """

        response = client.request(HttpMethod.GET, self.BASE)
        assert (
            response.headers.get("Content-Type") == HttpHeader.PLAIN_TEXT.with_charset
        )
