from domain.dtos import ErrorResponse

USER_NOT_FOUND = ErrorResponse(error="User not found")
EMAIL_ALREADY_IN_USE = ErrorResponse(error="User email already in use")
