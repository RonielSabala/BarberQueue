class DomainError(Exception):
    """
    Base for all domain exceptions.
    """


class ValidationError(DomainError):
    """
    A value object received an invalid value.
    """


class RequestError(DomainError):
    """
    A request was constructed incorrectly.
    """
