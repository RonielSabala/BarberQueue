from enum import StrEnum


class HttpHeader(StrEnum):
    """
    Enum for common content types used in http responses.
    """

    HTML_TEXT = "text/html"
    PLAIN_TEXT = "text/plain"

    def __init__(self, content_type: str) -> None:
        self.content_type = f"{content_type}; charset=UTF-8"
