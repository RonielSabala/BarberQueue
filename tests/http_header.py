from enum import StrEnum


class HttpHeader(StrEnum):
    """
    Common HTTP Content-Type header values.
    """

    JSON = "application/json"
    PLAIN_TEXT = "text/plain"

    @property
    def with_charset(self) -> str:
        return f"{self.value}; charset=UTF-8"
