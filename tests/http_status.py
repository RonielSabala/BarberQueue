from enum import IntEnum


class HttpStatus(IntEnum):
    """
    Common HTTP status codes.
    """

    OK = 200
    NO_CONTENT = 204
    NOT_FOUND = 404
    INTERNAL_SERVER_ERROR = 500
