# BarberQueue API Routes

Base URL: `BACKEND_URL`

All endpoints are prefixed with `/api`. All request and response bodies use `application/json`
unless noted otherwise.

---

## Table of Contents

- [Success Format](#success-format)
- [Error Format](#error-format)
- [Auth](#auth)
- [Users](#users)
- [Barbershops](#barbershops)

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

---

## Auth

### `POST /api/auth/login` <!-- omit from toc -->

Authenticate with email and password.

- Body

```json
{
  "email": "user_example@gmail.com",
  "password": "12345678"
}
```

- Response: `200`

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "user_example",
    "email": "user_example@gmail.com",
    "role": "admin"
  }
}
```

---

### `POST /api/auth/register` <!-- omit from toc -->

Register a new client account.

- Body

```json
{
  "username": "client_example",
  "email": "client_example@gmail.com",
  "phone": "8091234567",
  "password": "12345678"
}
```

- Response: `201`

```json
{
  "id": 1,
  "username": "client_example",
  "email": "client_example@gmail.com",
  "role": "client"
}
```

---

### `POST /api/auth/forgot-password` <!-- omit from toc -->

Send a password recovery email.

- Body

```json
{
  "email": "user_example@gmail.com"
}
```

- Response: `200`

```json
{
  "message": "Recovery email sent"
}
```

---

### `POST /api/auth/reset-password` <!-- omit from toc -->

Reset password using the reset code received by email.

- Body

```json
{
  "resetCode": 123456,
  "newPassword": "new_password"
}
```

- Response: `200`

```json
{
  "message": "Password updated"
}
```

---

## Users

### `GET /api/users/{id}` <!-- omit from toc -->

Get a user's profile.

- Response: `200`

```json
{
  "id": 1,
  "username": "user_example",
  "email": "user_example@gmail.com",
  "phone": "8091234567",
  "role": "admin"
}
```

---

### `PATCH /api/users/{id}` <!-- omit from toc -->

Update a user's profile fields. All fields are optional, but at least one must be provided.

- Body

```json
{
  "username": "new_username",
  "email": "new_email@gmail.com",
  "phone": "8091234567"
}
```

- Response: `200`

```json
{
  "message": "User updated"
}
```

---

### `PATCH /api/users/{id}/password` <!-- omit from toc -->

Update a user's password.

- Body

```json
{
  "currentPassword": "current_password",
  "newPassword": "new_password"
}
```

- Response: `200`

```json
{
  "message": "Password updated"
}
```

---

## Barbershops

### `GET /api/barbershops` <!-- omit from toc -->

List all active barbershops. Supports optional filters.

**Query params**

| Param    | Type                  | Description                         |
| -------- | --------------------- | ----------------------------------- |
| `search` | string                | Filter by name                      |
| `isOpen` | **true** \| **false** | Filter by current open/closed state |

- Response: `200`

```json
[
  {
    "id": 1,
    "barbershopName": "barbershop_name_example",
    "barbershopAddress": "123 Main Street",
    "photoUrl": "https://example.com/photo.jpg",
    "averageRating": 4.8,
    "isOpen": true
  }
]
```

---

### `POST /api/barbershops` <!-- omit from toc -->

Create a new barbershop. The only optional field is `capacity`, defaults to 1.

- Body

```json
{
  "barbershopName": "barbershop_name_example",
  "email": "barbershop_example@gmail.com",
  "phone": "8091234567",
  "barbershopAddress": "123 Main Street",
  "photoUrl": "https://example.com/photo.jpg",
  "opensAt": "08:00:00",
  "closesAt": "20:00:00",
  "capacity": 3
}
```

- Response: `201`

```json
{
  "id": 1,
  "barbershopName": "barbershop_name_example",
  "email": "barbershop_example@gmail.com",
  "phone": "8091234567",
  "barbershopAddress": "123 Main Street",
  "photoUrl": "https://example.com/photo.jpg",
  "opensAt": "08:00:00",
  "closesAt": "20:00:00",
  "capacity": 3,
  "isActive": true
}
```

---

### `GET /api/barbershops/{id}` <!-- omit from toc -->

Get full detail of a barbershop.

- Response: `200`

```json
{
  "id": 1,
  "barbershopName": "barbershop_name_example",
  "email": "barbershop_example@gmail.com",
  "phone": "8091234567",
  "barbershopAddress": "123 Main Street",
  "photoUrl": "https://example.com/photo.jpg",
  "opensAt": "08:00:00",
  "closesAt": "20:00:00",
  "capacity": 3,
  "isActive": true,
  "isOpen": true,
  "averageRating": 4.8
}
```

---

### `PATCH /api/barbershops/{id}` <!-- omit from toc -->

Update a barbershop's profile fields. All fields are optional, but at least one must be provided.

- Body

```json
{
  "barbershopName": "new_barbershop_name",
  "email": "new_email@gmail.com",
  "phone": "8097654321",
  "barbershopAddress": "456 New Street",
  "opensAt": "09:00:00",
  "closesAt": "18:00:00",
  "capacity": 5
}
```

- Response: `200`

```json
{
  "message": "Barbershop updated"
}
```

---

### `PATCH /api/barbershops/{id}/status` <!-- omit from toc -->

Toggle a barbershop open or closed status.

- Body

```json
{
  "isActive": false
}
```

- Response: `200`

```json
{
  "message": "Barbershop status updated"
}
```

---

### `PATCH /api/barbershops/{id}/photo` <!-- omit from toc -->

Replace the barbershop's main photo. Accepts `multipart/form-data`.

| Field   | Type                  |
| ------- | --------------------- |
| `photo` | file (jpg, png, webp) |

- Response: `200`

```json
{
  "photoUrl": "https://example.com/photo.jpg"
}
```

---

### `POST /api/barbershops/{id}/photos` <!-- omit from toc -->

Add one or more photos to the barbershop gallery. Accepts `multipart/form-data`.

| Field      | Type                    |
| ---------- | ----------------------- |
| `photos[]` | file[] (jpg, png, webp) |

- Response: `201`

```json
{
  "uploaded": [
    "https://example.com/photo_1.jpg",
    "https://example.com/photo_2.jpg"
  ]
}
```

---

### `DELETE /api/barbershops/{id}/photos/{photoId}` <!-- omit from toc -->

Remove a photo from the gallery.

- Response: `204`

---

### `GET /api/barbershops/{id}/reviews` <!-- omit from toc -->

List all reviews for a barbershop.

- Response: `200`

```json
[
  {
    "id": 1,
    "userId": 1,
    "username": "user_example",
    "rating": 5,
    "content": "Great service, highly recommended.",
    "createdAt": "2026-03-05T09:00:00"
  }
]
```

---

### `POST /api/barbershops/{id}/reviews` <!-- omit from toc -->

Submit a review for a barbershop.

- Body

```json
{
  "userId": 1,
  "rating": 5,
  "content": "Great service, highly recommended."
}
```

- Response: `201`

```json
{
  "id": 1,
  "userId": 1,
  "username": "user_example",
  "rating": 5,
  "content": "Great service, highly recommended.",
  "createdAt": "2026-03-05T09:00:00"
}
```

---

### `GET /api/barbershops/{id}/employees` <!-- omit from toc -->

List all employees assigned to a barbershop.

- Response: `200`

```json
[
  {
    "id": 1,
    "username": "barber_example",
    "email": "barber_example@gmail.com",
    "phone": "8091234567",
    "role": "barber",
    "startTime": "08:00:00",
    "endTime": "16:00:00",
    "workingDays": [1, 2, 3, 4, 5]
  }
]
```
