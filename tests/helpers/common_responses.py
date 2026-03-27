from domain.dtos import ErrorResponse

AT_LEAST_ONE_FIELD = ErrorResponse(
    error="At least one field must be provided for update"
)

# Users
USER_NOT_FOUND = ErrorResponse(error="User not found")
EMAIL_ALREADY_IN_USE = ErrorResponse(error="User email already in use")

# Barbershops
BARBERSHOP_NOT_FOUND = ErrorResponse(error="Barbershop not found")
PHOTO_NOT_FOUND = ErrorResponse(error="Barbershop photo not found")
REVIEW_NOT_FOUND = ErrorResponse(error="Barbershop review not found")
ASSIGNMENT_NOT_FOUND = ErrorResponse(error="Assignment not found")
