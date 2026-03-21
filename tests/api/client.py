from __future__ import annotations

from typing import Any

import requests

from api.controllers import AuthController
from api.core import HttpMethod


class ApiClient:
    """
    Single entry point for all API calls.
    """

    TIMEOUT: int = 5

    def __init__(self, base_url: str) -> None:
        self._base_url = base_url.rstrip("/")
        self._session = requests.Session()

        # Route groups
        self.auth = AuthController(self)

    def _url(self, path: str) -> str:
        return f"{self._base_url}{path}"

    def _auth_header(self, token: str | None) -> dict:
        if not token:
            return {}

        return {"Authorization": f"Bearer {token}"}

    def request(
        self,
        method: HttpMethod,
        path: str,
        *,
        token: str | None = None,
        body: dict | None = None,
        **kwargs: Any,
    ) -> requests.Response:
        return self._session.request(
            method=method,
            url=self._url(path),
            json=body,
            headers=self._auth_header(token),
            timeout=self.TIMEOUT,
            **kwargs,
        )
