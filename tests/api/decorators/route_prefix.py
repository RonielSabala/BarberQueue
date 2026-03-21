"""
HTTP route prefix decorator for route controllers.
"""

from __future__ import annotations

from collections.abc import Callable

from api.base_controller import BaseController


def route_prefix[T: type[BaseController]](prefix: str) -> Callable[[T], T]:
    def decorator(cls: T) -> T:
        cls.prefix = prefix
        return cls

    return decorator
