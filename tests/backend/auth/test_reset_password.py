from api.client import ApiClient
from domain.requests.auth import ResetPasswordRequest
from http_status import HttpStatus


class TestResetPassword:
    """
    Tests for POST /api/auth/reset-password
    """

    def test_invalid_code_returns_bad_request(self, client: ApiClient) -> None:
        """
        An invalid or expired reset code returns 400.
        """

        response = client.auth.reset_password(ResetPasswordRequest.random())
        assert response.status_code == HttpStatus.BAD_REQUEST

    def test_body_on_invalid_code(self, client: ApiClient) -> None:
        """
        Invalid code response contains an error field.
        """

        response = client.auth.reset_password(ResetPasswordRequest.random())
        assert "error" in response.json()
