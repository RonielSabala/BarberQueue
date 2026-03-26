from domain.dtos import ErrorResponse

USER_NOT_FOUND = ErrorResponse(error="User not found")
EMAIL_ALREADY_IN_USE = ErrorResponse(error="User email already in use")
BARBERSHOP_NOT_FOUND = ErrorResponse(error="Barbershop not found")
PHOTO_NOT_FOUND = ErrorResponse(error="Barbershop photo not found")
REVIEW_NOT_FOUND = ErrorResponse(error="Barbershop review not found")
ASSIGNMENT_NOT_FOUND = ErrorResponse(error="Assignment not found")
