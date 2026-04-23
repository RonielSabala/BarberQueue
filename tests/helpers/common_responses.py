from domain.dtos import ErrorResponse

# Validation
UNEXPECTED_FIELDS = "Unexpected field(s): {fields}"
AT_LEAST_ONE_FIELD = ErrorResponse(
    error="At least one field must be provided for update"
)
FIELD_REQUIRED = "Field '{field}' is required"
FIELD_NON_NULLABLE = "Field '{field}' cannot be null"
FIELD_MUST_BE_OBJECT = "Field '{field}' must be an object"
FIELD_MUST_BE_ARRAY = "Field '{field}' must be an array"
FIELD_MIN_ITEMS = "Field '{field}[]' must have at least {min_items} item(s)"
FIELD_MAX_ITEMS = "Field '{field}[]' must have at most {max_items} item(s)"

# Users
USER_NOT_FOUND = ErrorResponse(error="User not found")
USER_EMAIL_IN_USE = ErrorResponse(error="User email already in use")

# Employees
EMPLOYEE_NOT_FOUND = ErrorResponse(error="Employee not found")
EMPLOYEE_ASSIGNMENT_NOT_FOUND = ErrorResponse(error="Employee assignment not found")

# Barbershops
BARBERSHOP_NOT_FOUND = ErrorResponse(error="Barbershop not found")

# Clients
CLIENT_NOT_FOUND = ErrorResponse(error="Client not found in barbershop")
CLIENT_NOT_AT_BARBERSHOP = ErrorResponse(
    error="The client is not currently checked into any barbershop"
)

# Barbers
BARBER_NOT_FOUND = ErrorResponse(error="Barber not found")

# Turns
TURN_NOT_FOUND = ErrorResponse(error="Turn not found")
