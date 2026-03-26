from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from api.client import ApiClient


class BaseRoutes:
    """
    Base route groups class.
    """

    _BASE: str = ""

    def __init__(self, client: ApiClient) -> None:
        self._client = client
