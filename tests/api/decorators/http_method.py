"""
HTTP verb decorators for route methods.
"""

import functools
import re
from collections.abc import Callable

import requests

from api.base_controller import BaseController
from api.core import HttpMethod
from domain.dtos import BaseRequest
from domain.utils import to_camel_case
from helpers.body_route import BodyRoute

_PATH_PARAM_PATTERN = re.compile(r"\{[^}]+\}")


def _build_url(path: str, args: tuple) -> str:
    """
    Replace placeholders in path with positional args
    in order.
    """

    params = iter(args)
    return _PATH_PARAM_PATTERN.sub(lambda _: str(next(params)), path)


def _route(method: HttpMethod, path: str, *, body: bool = False) -> Callable:
    param_count = len(_PATH_PARAM_PATTERN.findall(path))

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(self: BaseController, *args, **kwargs) -> requests.Response:
            request_body = None
            if body:
                body_args = args[param_count:]

                request_body = None
                if body_args and isinstance(body_args[0], BaseRequest):
                    request_body = body_args[0].to_json()

            url = self.prefix + _build_url(path, args[:param_count])
            params = {to_camel_case(k): v for k, v in kwargs.items()} or None
            return self._client.request(method, url, body=request_body, params=params)

        # Store metadata for route discovery
        if body:
            wrapper.__body_route__ = BodyRoute.from_function(func, method, path)  # type: ignore[attr-defined]

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
