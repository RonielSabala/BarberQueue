from typing import Any

import requests

from api.controllers import (
    AuthController,
    BarberController,
    BarbershopController,
    EmployeeController,
    UserController,
)
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
        self.users = UserController(self)
        self.barbershops = BarbershopController(self)
        self.employees = EmployeeController(self)
        self.barbers = BarberController(self)

    def _url(self, path: str) -> str:
        return f"{self._base_url}{path}"

    def request(
        self,
        method: HttpMethod,
        path: str,
        *,
        body: dict | None = None,
        params: dict | None = None,
        headers: dict | None = None,
        **kwargs: Any,
    ) -> requests.Response:
        default_headers = {"X-App-Env": "testing"}
        if headers:
            default_headers.update(headers)

        return self._session.request(
            method=method,
            url=self._url(path),
            json=body,
            params=params,
            headers=default_headers,
            timeout=self.TIMEOUT,
            **kwargs,
        )
