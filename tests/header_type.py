from enum import Enum


class HeaderType(str, Enum):
    """
    Enum for common content types used in HTTP responses.
    """

    HTML_TEXT = "text/html"
    PLAIN_TEXT = "text/plain"

    def __init__(self, content_type: str) -> None:
        self.content_type = f"{content_type}; charset=UTF-8"
