"""
HTTP verb decorators for route methods.
"""

from __future__ import annotations

import functools
from collections.abc import Callable

import requests

from api.base_controller import BaseController
from api.core import HttpMethod
from domain.dtos import BaseRequest
from domain.exceptions import RequestError


def _route(method: HttpMethod, path: str, *, body: bool = False) -> Callable:
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(
            self: BaseController, *args, token: str | None = None, **kwargs
        ) -> requests.Response:
            url = self.prefix + path
            if not body:
                return self._client.request(method, url, token=token)

            request = args[0]
            if not isinstance(request, BaseRequest):
                raise RequestError("Expected a BaseRequest object as first argument")

            return self._client.request(
                method, url, body=request.to_json(), token=token
            )

        return wrapper

    return decorator


def GET(path: str) -> Callable:
    return _route(HttpMethod.GET, path, body=False)


def POST(path: str) -> Callable:
    return _route(HttpMethod.POST, path, body=True)


def PUT(path: str) -> Callable:
    return _route(HttpMethod.PUT, path, body=True)


def PATCH(path: str) -> Callable:
    return _route(HttpMethod.PATCH, path, body=True)


def DELETE(path: str) -> Callable:
    return _route(HttpMethod.DELETE, path, body=False)
