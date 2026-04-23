# BarberQueue API Error Reference

Errors are grouped by domain. Each entry shows the identifier used in [`docs/ROUTES.md`](ROUTES.md)., the HTTP status, and the exact message string the API returns.

---

## Generic

| Identifier        | Status | Message               |
| ----------------- | ------ | --------------------- |
| `ROUTE_NOT_FOUND` | 404    | Route not found       |
| `INTERNAL_ERROR`  | 500    | Internal server error |

---

## Validation

| Identifier           | Status | Message                          |
| -------------------- | ------ | -------------------------------- |
| `FIELD_REQUIRED`     | 400    | Field '{field}' is required      |
| `FIELD_INVALID_TYPE` | 400    | Field '{field}' must be a {type} |
| `UNEXPECTED_FIELD`   | 400    | Unexpected field '{field}'       |

---

## Auth

| Identifier                | Status | Message                       |
| ------------------------- | ------ | ----------------------------- |
| `INVALID_CREDENTIALS`     | 401    | Invalid credentials           |
| `EMAIL_ALREADY_IN_USE`    | 409    | Email is already in use       |
| `INVALID_OR_EXPIRED_CODE` | 422    | Invalid or expired reset code |

---

## Users

| Identifier                   | Status | Message                                  |
| ---------------------------- | ------ | ---------------------------------------- |
| `USER_NOT_FOUND`             | 404    | User not found                           |
| `CANNOT_UPDATE_ANOTHER_USER` | 403    | You cannot update another user's profile |
| `INCORRECT_CURRENT_PASSWORD` | 422    | Current password is incorrect            |

---

## Barbershops

| Identifier                | Status | Message                                     |
| ------------------------- | ------ | ------------------------------------------- |
| `BARBERSHOP_NOT_FOUND`    | 404    | Barbershop not found                        |
| `BARBERSHOP_EMAIL_IN_USE` | 409    | A barbershop with this email already exists |

---

## Employees

| Identifier              | Status | Message                                                                   |
| ----------------------- | ------ | ------------------------------------------------------------------------- |
| `EMPLOYEE_NOT_FOUND`    | 404    | Employee not found                                                        |
| `INVALID_EMPLOYEE_ROLE` | 422    | Only barbers and assistants can be employees                              |
| `ALREADY_ASSIGNED`      | 409    | Employee is already assigned to this barbershop                           |
| `START_EQUALS_END`      | 422    | Start time must be different from end time                                |
| `START_AFTER_END`       | 422    | Start time must be earlier than end time                                  |
| `START_BEFORE_OPENING`  | 422    | Start time cannot be earlier than the barbershop opening time ({opensAt}) |
| `END_AFTER_CLOSING`     | 422    | End time cannot be later than the barbershop closing time ({closesAt})    |
| `SCHEDULE_CONFLICT`     | 409    | The employee already has an overlapping schedule on {days}                |

---

## Barbers

| Identifier                | Status | Message                                                                                                                   |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `BARBER_NOT_FOUND`        | 404    | Barber not found                                                                                                          |
| `BARBER_NOT_ACTIVE`       | 422    | Barber is not active or not accepting clients                                                                             |
| `BARBER_HAS_ACTIVE_TURNS` | 422    | Cannot change status while there are active turns in your queue. Set is_accepting to false to stop receiving new clients. |

---

## Clients

| Identifier                  | Status | Message                                                        |
| --------------------------- | ------ | -------------------------------------------------------------- |
| `CLIENT_NOT_FOUND`          | 404    | Client not found                                               |
| `CLIENT_NOT_AT_BARBERSHOP`  | 400    | Client is not at a barbershop                                  |
| `CLIENT_ALREADY_CHECKED_IN` | 409    | Client is already checked in at a barbershop                   |
| `CLIENT_CANNOT_CHECK_OUT`   | 422    | Client must have status at_barbershop or paid to check out     |
| `CLIENT_NO_ACTIVE_TURN`     | 404    | The client currently has no turn despite being in a barbershop |

---

## Group Members

| Identifier              | Status | Message                                    |
| ----------------------- | ------ | ------------------------------------------ |
| `MEMBER_NOT_FOUND`      | 404    | Member not found                           |
| `MEMBER_NO_ACTIVE_TURN` | 404    | No active turn found for this group member |

---

## Reviews

| Identifier         | Status | Message                               |
| ------------------ | ------ | ------------------------------------- |
| `REVIEW_NOT_FOUND` | 404    | Review not found                      |
| `ALREADY_REVIEWED` | 409    | You have already reviewed this barber |

---

## Turns

| Identifier               | Status | Message                                                               |
| ------------------------ | ------ | --------------------------------------------------------------------- |
| `TURN_NOT_FOUND`         | 404    | Turn not found                                                        |
| `CLIENT_NOT_ON_QUEUE`    | 422    | Client must have status at_barbershop to join the queue               |
| `TURN_NOT_ON_QUEUE`      | 422    | Only on_queue turns can be set to waiting                             |
| `TURN_NOT_WAITING`       | 422    | Only waiting turns can be set back to on_queue                        |
| `TURN_NOT_IN_SERVICE`    | 422    | Only in_service turns can be attended                                 |
| `TURN_NOT_ATTENDED`      | 422    | Client must have status attended to pay                               |
| `GROUP_NOT_ALL_ATTENDED` | 422    | All group members must have status attended before the group can pay  |
| `LEADER_NOT_ATTENDED`    | 422    | Group leader must have status attended to pay for the group           |
| `MEMBER_CANNOT_PAY`      | 422    | Member turns cannot be paid independently — the group leader must pay |
