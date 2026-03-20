import pytest

from api.client import ApiClient
from domain.requests.auth import LoginRequest, RegisterRequest
from http_header import HttpHeader
from http_status import HttpStatus


class TestLogin:
    """
    Tests for POST /api/auth/login
    """

    @pytest.fixture(scope="class")
    def registered(self, client: ApiClient) -> LoginRequest:
        """
        Register a user once per class and return matching
        login credentials.
        """

        reg = RegisterRequest.random()
        client.auth.register(reg)
        return LoginRequest(email=reg.email, password=reg.password)

    def test_status(self, client: ApiClient, registered: LoginRequest) -> None:
        """
        Successful login returns 200.
        """

        response = client.auth.login(registered)
        assert response.status_code == HttpStatus.OK

    def test_body_has_token(self, client: ApiClient, registered: LoginRequest) -> None:
        """
        Response contains a JWT token.
        """

        body = client.auth.login(registered).json()
        assert "token" in body

    def test_body_has_user(self, client: ApiClient, registered: LoginRequest) -> None:
        """
        Response user object has expected fields.
        """

        user = client.auth.login(registered).json().get("user", {})
        assert {"id", "username", "email", "role"}.issubset(user.keys())

    def test_wrong_password_returns_unauthorized(
        self, client: ApiClient, registered: LoginRequest
    ) -> None:
        """
        Wrong password returns 401.
        """

        wrong = LoginRequest(
            email=registered.email,
            password=registered.password.__class__("wrongpassword123"),
        )

        assert client.auth.login(wrong).status_code == HttpStatus.UNAUTHORIZED

    def test_unknown_email_returns_unauthorized(self, client: ApiClient) -> None:
        """
        Non-existent email returns 401.
        """

        response = client.auth.login(LoginRequest.random())
        assert response.status_code == HttpStatus.UNAUTHORIZED

    def test_content_type(self, client: ApiClient, registered: LoginRequest) -> None:
        """
        Response is JSON.
        """

        response = client.auth.login(registered)
        assert response.headers.get("Content-Type") == HttpHeader.JSON.with_charset
