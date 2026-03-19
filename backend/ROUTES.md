# BarberQueue API Routes

Base URL: `BACKEND_URL`

All endpoints are prefixed with `/api`. All request and response bodies use `application/json`
unless noted otherwise.

---

## Table of Contents

- [Success Format](#success-format)
- [Error Format](#error-format)
- [Auth](#auth)

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
| `409`  | Conflict error                               |
| `422`  | Validation failed                            |
| `500`  | Internal server error                        |

## Auth

### `POST /api/auth/login`

Authenticate with email and password.

- Body

```json
{
  "email": "correo@ejemplo.com",
  "password": "123456"
}
```

- Response: `200`

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "Juan",
    "email": "correo@ejemplo.com",
    "role": "client"
  }
}
```

---

### `POST /api/auth/register`

Register a new client account.

- Body

```json
{
  "username": "Juan Perez",
  "email": "juan@gmail.com",
  "phone": "8091234567",
  "password": "123456"
}
```

- Response: `201`

```json
{
  "id": 9,
  "username": "Juan Perez",
  "email": "juan@gmail.com",
  "role": "client"
}
```

---

### `POST /api/auth/forgot-password`

Send a password recovery email.

- Body

```json
{
  "email": "juan@gmail.com"
}
```

- Response: `200`

```json
{
  "message": "Recovery email sent"
}
```

---

### `POST /api/auth/reset-password`

Reset password using the reset code received by email.

- Body

```json
{
  "reset_code": "456123",
  "password": "newpassword100"
}
```

- Response: `200`

```json
{
  "message": "Password updated"
}
```
