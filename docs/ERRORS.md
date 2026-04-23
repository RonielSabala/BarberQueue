# BarberQueue API Error Reference

Errors are grouped by domain. Each entry shows the identifier used in [`docs/ROUTES.md`](ROUTES.md)., the HTTP status, and the exact message string the API returns.

---

## Generic

| Identifier            | Status | Message                      |
| --------------------- | ------ | ---------------------------- |
| `ROUTE_NOT_FOUND`     | 404    | Route not found              |
| `SERVICE_UNAVAILABLE` | 500    | Service unavailable          |
| `UNEXPECTED_ERROR`    | 500    | An unexpected error occurred |

---

## Validation

| Identifier             | Status | Message                                                 |
| ---------------------- | ------ | ------------------------------------------------------- |
| `UNEXPECTED_FIELDS`    | 400    | Unexpected field(s): {fields}                           |
| `AT_LEAST_ONE_FIELD`   | 400    | At least one field must be provided for update          |
| `FIELD_REQUIRED`       | 400    | Field '{field}' is required                             |
| `FIELD_NON_NULLABLE`   | 400    | Field '{field}' cannot be null                          |
| `FIELD_MUST_BE_OBJECT` | 400    | Field '{field}' must be an object                       |
| `FIELD_MUST_BE_ARRAY`  | 400    | Field '{field}' must be an array                        |
| `FIELD_MIN_ITEMS`      | 400    | Field '{field}[]' must have at least {minItems} item(s) |
| `FIELD_MAX_ITEMS`      | 400    | Field '{field}[]' must have at most {maxItems} item(s)  |

---

## Auth

| Identifier                   | Status | Message                                       |
| ---------------------------- | ------ | --------------------------------------------- |
| `INVALID_CREDENTIALS`        | 401    | Invalid credentials                           |
| `INVALID_OR_EXPIRED_CODE`    | 400    | Invalid or expired code                       |
| `CURRENT_PASSWORD_INCORRECT` | 422    | Current password is incorrect                 |
| `NEW_PASSWORD_MUST_DIFFER`   | 422    | New password must differ from the current one |
| `GOOGLE_AUTH_ERROR`          | 422    | Error authenticating with Google              |
| `MAIL_ERROR`                 | 500    | Mail could not be sent                        |

---

## Users

| Identifier          | Status | Message                   |
| ------------------- | ------ | ------------------------- |
| `USER_NOT_FOUND`    | 404    | User not found            |
| `USER_EMAIL_IN_USE` | 409    | User email already in use |

---

## Employees

| Identifier                      | Status | Message                                                       |
| ------------------------------- | ------ | ------------------------------------------------------------- |
| `EMPLOYEE_NOT_FOUND`            | 404    | Employee not found                                            |
| `EMPLOYEE_ASSIGNMENT_NOT_FOUND` | 404    | Employee assignment not found                                 |
| `NOT_AN_EMPLOYEE`               | 422    | This user is not an employee                                  |
| `ONLY_BARBERS_AND_ASSISTANTS`   | 422    | Only barbers and assistants can be employees                  |
| `START_EQUALS_END`              | 422    | Start time must be different from end time                    |
| `START_AFTER_END`               | 422    | Start time must be earlier than end time                      |
| `START_BEFORE_OPENING`          | 422    | Start time cannot be earlier than the barbershop opening time |
| `END_AFTER_CLOSING`             | 422    | End time cannot be later than the barbershop closing time     |
| `SCHEDULE_CONFLICT`             | 409    | The employee already has an overlapping schedule on {days}    |
| `ALREADY_ASSIGNED`              | 409    | Employee is already assigned to this barbershop               |

---

## Clients

| Identifier                            | Status | Message                                                     |
| ------------------------------------- | ------ | ----------------------------------------------------------- |
| `CLIENT_NOT_FOUND`                    | 404    | Client not found in barbershop                              |
| `CLIENT_NOT_AT_BARBERSHOP`            | 400    | The client is not currently checked into any barbershop     |
| `CLIENT_ALREADY_CHECKED_IN`           | 409    | The client is registered at a different barbershop location |
| `CLIENT_ALREADY_IN_BARBERSHOP`        | 409    | Client is already active in a barbershop                    |
| `CLIENT_CANNOT_CHECK_IN`              | 403    | Only clients can check in to a barbershop                   |
| `CLIENT_CANNOT_CHECK_OUT`             | 403    | Only 'at_barbershop' or 'paid' clients can check out        |
| `CLIENT_CANNOT_JOIN_QUEUE`            | 403    | Only 'at_barbershop' clients can join to a queue            |
| `CLIENT_CANNOT_BE_WAITING`            | 403    | Only 'on_queue' clients can be set to 'waiting'             |
| `CLIENT_CANNOT_BE_ON_QUEUE`           | 403    | Only 'waiting' clients can be set back to 'on_queue'        |
| `CLIENT_CANNOT_BE_ATTENDED`           | 403    | Only 'in_service' clients can be attended                   |
| `CLIENT_CANNOT_PAY`                   | 403    | Only 'attended' clients can pay                             |
| `ONLY_CLIENTS_CAN_REVIEW_BARBERS`     | 403    | Only clients can leave reviews to barbers                   |
| `ONLY_CLIENTS_CAN_REVIEW_BARBERSHOPS` | 403    | Only clients can leave reviews to barbershops               |

---

## Group Members

| Identifier                 | Status | Message                                                                |
| -------------------------- | ------ | ---------------------------------------------------------------------- |
| `MEMBER_NOT_FOUND`         | 404    | Member not found                                                       |
| `MEMBER_CANNOT_PAY`        | 403    | Member turns cannot be paid independently. The group leader must pay   |
| `MEMBERS_MUST_BE_ATTENDED` | 403    | All group members must have status 'attended' before the group can pay |

---

## Barbers

| Identifier                       | Status | Message                                                         |
| -------------------------------- | ------ | --------------------------------------------------------------- |
| `BARBER_NOT_FOUND`               | 404    | Barber not found                                                |
| `BARBER_NOT_FOUND_IN_BARBERSHOP` | 404    | Barber not found in this barbershop                             |
| `BARBER_REVIEW_NOT_FOUND`        | 404    | Barber review not found                                         |
| `NOT_A_BARBER`                   | 422    | This user is not a barber                                       |
| `BARBER_NOT_ACTIVE`              | 422    | Barber is not active                                            |
| `BARBER_NOT_ACCEPTING`           | 422    | Barber is not accepting new clients                             |
| `BARBER_HAS_ACTIVE_TURNS`        | 422    | Cannot change status while there are active turns in your queue |

---

## Admins

| Identifier                        | Status | Message                         |
| --------------------------------- | ------ | ------------------------------- |
| `ONLY_ADMINS_CAN_OWN_BARBERSHOPS` | 409    | Only admins can own barbershops |

---

## Barbershops

| Identifier                | Status | Message                         |
| ------------------------- | ------ | ------------------------------- |
| `BARBERSHOP_IS_FULL`      | 422    | Barbershop is full              |
| `BARBERSHOP_NOT_OPEN`     | 422    | Barbershop is not open          |
| `BARBERSHOP_NOT_FOUND`    | 404    | Barbershop not found            |
| `BARBERSHOP_EMAIL_IN_USE` | 409    | Barbershop email already in use |

---

## Turns

| Identifier                         | Status | Message                                                        |
| ---------------------------------- | ------ | -------------------------------------------------------------- |
| `TURN_NOT_FOUND`                   | 404    | Turn not found                                                 |
| `CLIENT_TURN_NOT_FOUND`            | 404    | No active turn found for this client                           |
| `MEMBER_TURN_NOT_FOUND`            | 404    | No active turn found for this group member                     |
| `NO_TURN_FOR_CLIENT_AT_BARBERSHOP` | 404    | The client currently has no turn despite being in a barbershop |
| `CANNOT_DELETE_TURN`               | 422    | Cannot delete a turn that has been completed                   |
