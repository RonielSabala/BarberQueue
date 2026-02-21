from enum import IntEnum


class HttpStatus(IntEnum):
    """
    Enum for common status used in http responses.
    """

    OK = 200
    NO_CONTENT = 204
    NOT_FOUND = 404
    INTERNAL_SERVER_ERROR = 500

    def __init__(self, status: int) -> None:
        self.response = f"{status}; charset=UTF-8"
