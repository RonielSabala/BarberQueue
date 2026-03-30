from domain.dtos import ErrorResponse

AT_LEAST_ONE_FIELD = ErrorResponse(
    error="At least one field must be provided for update"
)
ASSIGNMENT_NOT_FOUND = ErrorResponse(error="Assignment not found")

# Users
USER_NOT_FOUND = ErrorResponse(error="User not found")
EMAIL_ALREADY_IN_USE = ErrorResponse(error="User email already in use")

# Barbershops
BARBERSHOP_NOT_FOUND = ErrorResponse(error="Barbershop not found")

# Employees
EMPLOYEE_NOT_FOUND = ErrorResponse(error="Employee not found")

# Barbers
BARBER_NOT_FOUND = ErrorResponse(error="Barber not found")
