from __future__ import annotations

from typing import TYPE_CHECKING, ClassVar

if TYPE_CHECKING:
    from api.client import ApiClient


class BaseRoutes:
    """
    Base class for all API route groups.

    Each subclass maps to a single PHP controller and declares
    its routes as decorated methods. The prefix is set via
    the `route_prefix` decorator.
    """

    prefix: ClassVar[str] = ""

    def __init__(self, client: ApiClient) -> None:
        self._client = client
