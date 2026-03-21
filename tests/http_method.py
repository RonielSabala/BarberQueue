from enum import StrEnum


class HttpMethod(StrEnum):
    """
    Common HTTP method verbs.
    """

    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    PATCH = "PATCH"
    DELETE = "DELETE"
