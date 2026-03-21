from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field
from typing import get_type_hints

from api.core import HttpMethod
from domain.dtos import BaseRequest


@dataclass(slots=True)
class BodyRoute:
    method_name: str
    http_method: HttpMethod
    path: str
    full_path: str = field(default="", init=False)
    request_class: type[BaseRequest]

    @classmethod
    def from_function(
        cls, func: Callable, http_method: HttpMethod, path: str
    ) -> BodyRoute:
        hints = get_type_hints(func)
        request_class = tuple(hints.values())[0]
        return cls(func.__qualname__, http_method, path, request_class)

    def set_full_path(self, route_prefix: str) -> None:
        self.full_path = route_prefix + self.path
