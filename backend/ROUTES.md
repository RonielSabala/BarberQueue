# BarberQueue API Routes

Base URL: `BACKEND_URL`

All endpoints are prefixed with `/api`. All request and response bodies use `application/json`
unless noted otherwise.

---

## Table of Contents

- [Success Format](#success-format)
- [Error Format](#error-format)

---

## Success Format

Successful responses return the relevant resource or a confirmation message.
The shape varies by endpoint and is documented per route.

For operations that return a resource:

```json
{
  "id": 1,
  "username": "Juan"
}
```

For operations that only confirm an action:

```json
{
  "message": "Human readable confirmation"
}
```

| Status | Meaning                                          |
| ------ | ------------------------------------------------ |
| `200`  | Request succeeded, body contains the result      |
| `201`  | Resource created, body contains the new resource |
| `204`  | Request succeeded, no body returned              |

---

## Error Format

All error responses follow this shape:

```json
{
  "error": "Human readable message"
}
```

| Status | Meaning                                      |
| ------ | -------------------------------------------- |
| `400`  | **Bad request**: missing or invalid fields   |
| `401`  | **Unauthorized**: missing or invalid token   |
| `403`  | **Forbidden**: authenticated but not allowed |
| `404`  | Resource not found                           |
| `422`  | Validation failed                            |
| `500`  | Internal server error                        |
