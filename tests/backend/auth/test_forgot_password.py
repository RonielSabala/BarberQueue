from api.client import ApiClient
from domain.requests.auth import ForgotPasswordRequest, RegisterRequest
from http_status import HttpStatus


class TestForgotPassword:
    """
    Tests for POST /api/auth/forgot-password
    """

    def test_status_known_email(self, client: ApiClient) -> None:
        """
        Known email returns 200.
        """

        reg = RegisterRequest.random()
        client.auth.register(reg)
        response = client.auth.forgot_password(ForgotPasswordRequest(email=reg.email))
        assert response.status_code == HttpStatus.OK

    def test_status_unknown_email(self, client: ApiClient) -> None:
        """
        Unknown email also returns 200.
        """

        response = client.auth.forgot_password(ForgotPasswordRequest.random())
        assert response.status_code == HttpStatus.OK

    def test_body(self, client: ApiClient) -> None:
        """
        Response contains a confirmation message.
        """

        response = client.auth.forgot_password(ForgotPasswordRequest.random())
        assert response.json() == {"message": "Recovery email sent"}
