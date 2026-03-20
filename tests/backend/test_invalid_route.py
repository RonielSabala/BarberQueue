from api.client import ApiClient
from http_header import HttpHeader
from http_method import HttpMethod
from http_status import HttpStatus

EXPECTED_BODY = {"error": "Route not found"}


class TestInvalidRoute:
    """
    Tests for requests to unknown routes.
    """

    BASE = "/api/this-route-does-not-exist"

    def test_status(self, client: ApiClient) -> None:
        """
        Unknown routes return 404.
        """

        response = client.request(HttpMethod.GET, self.BASE)
        assert response.status_code == HttpStatus.NOT_FOUND

    def test_body(self, client: ApiClient) -> None:
        """
        Unknown routes return a structured JSON error.
        """

        response = client.request(HttpMethod.GET, self.BASE)
        assert response.json() == EXPECTED_BODY

    def test_content_type(self, client: ApiClient) -> None:
        """
        Unknown routes return JSON content type.
        """

        response = client.request(HttpMethod.GET, self.BASE)
        assert response.headers.get("Content-Type") == HttpHeader.JSON.with_charset
