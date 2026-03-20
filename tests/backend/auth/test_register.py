from api.client import ApiClient
from domain.requests.auth import RegisterRequest
from http_header import HttpHeader
from http_method import HttpMethod
from http_status import HttpStatus


class TestRegister:
    """
    Tests for POST /api/auth/register
    """

    def test_status(self, client: ApiClient) -> None:
        """
        Successful registration returns 201.
        """

        response = client.auth.register(RegisterRequest.random())
        assert response.status_code == HttpStatus.CREATED

    def test_body_shape(self, client: ApiClient) -> None:
        """
        Response contains id, username, email, role.
        """

        body = client.auth.register(RegisterRequest.random()).json()
        assert {"id", "username", "email", "role"}.issubset(body.keys())

    def test_role_is_client(self, client: ApiClient) -> None:
        """
        Registered users always get the client role.
        """

        body = client.auth.register(RegisterRequest.random()).json()
        assert body["role"] == "client"

    def test_email_matches_input(self, client: ApiClient) -> None:
        """
        Response email matches the registered email.
        """

        request = RegisterRequest.random()
        body = client.auth.register(request).json()
        assert body["email"] == request.email.value

    def test_content_type(self, client: ApiClient) -> None:
        """
        Response is JSON.
        """

        response = client.auth.register(RegisterRequest.random())
        assert response.headers.get("Content-Type") == HttpHeader.JSON.with_charset

    def test_duplicate_email_returns_conflict(self, client: ApiClient) -> None:
        """
        Registering the same email twice returns 409.
        """

        request = RegisterRequest.random()
        client.auth.register(request)

        duplicate = RegisterRequest(
            username=request.username,
            email=request.email,
            phone=request.phone,
            password=request.password,
        )

        response = client.auth.register(duplicate)
        assert response.status_code == HttpStatus.CONFLICT

    def test_missing_field_returns_bad_request(self, client: ApiClient) -> None:
        """
        Omitting a required field returns 400.
        """

        incomplete = {"username": "Test User", "email": "test@test.com"}
        response = client.request(
            HttpMethod.POST, "/api/auth/register", body=incomplete
        )

        assert response.status_code == HttpStatus.BAD_REQUEST
