from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field
from typing import get_type_hints

from api.core import HttpMethod
from domain.dtos import BaseRequest
from helpers.unwrap_type import unwrap_type


def _extract_request_class(func: Callable) -> type[BaseRequest] | None:
    """
    Extract the `BaseRequest` subclass from the function's type hints.
    """

    hints = get_type_hints(func)
    return next(
        (
            unwrapped
            for key, hint in hints.items()
            if key != "return"
            and (unwrapped := unwrap_type(hint)) is not None
            and issubclass(unwrapped, BaseRequest)
        ),
        None,
    )


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
        request_class = _extract_request_class(func)
        if request_class is None:
            raise ValueError(
                f"No BaseRequest subclass found in {func.__qualname__} type hints"
            )

        return cls(func.__qualname__, http_method, path, request_class)

    def set_full_path(self, route_prefix: str) -> None:
        self.full_path = route_prefix + self.path
