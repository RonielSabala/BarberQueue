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
  - [Barbershop Photos](#barbershop-photos)
  - [Barbershop Reviews](#barbershop-reviews)
  - [Barbershop Employees](#barbershop-employees)
  - [Barbershop Clients](#barbershop-clients)
- [Employees](#employees)
- [Barbers](#barbers)
  - [Barber Reviews](#barber-reviews)
- [Clients](#clients)
- [Group Members](#group-members)
- [Queues](#queues)
- [Turns](#turns)

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

### `GET /api/auth/google/url` <!-- omit from toc -->

Returns the Google OAuth URL.

The frontend must open this URL in the browser using `window.location.href`, **not** fetch it with `axios` or `fetch`, since the user needs to be redirected to Google's login page.

- Response: `200`

```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

---

### `GET /api/auth/google` <!-- omit from toc -->

Google's OAuth callback endpoint.

This is called automatically by the browser after the user authenticates with Google, it should **never be called directly** by the frontend.

After processing, the backend redirects the browser to the frontend callback route with the session data in the query string:

```plain
{FRONTEND_URL}/auth/callback?token=jwt_token&id=1&username=user_example&role=client
```

On error, the backend redirects to:

```plain
{FRONTEND_URL}/auth/callback?error=auth_failed
```

The frontend `/auth/callback` route is responsible for reading these query params, storing the token, and redirecting the user to the home page.

| Query param | Type   | Description                                        |
| ----------- | ------ | -------------------------------------------------- |
| `code`      | string | Authorization code sent by Google after user login |

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

### `GET /api/users` <!-- omit from toc -->

List all users. Supports optional filters.

| Param      | Type   | Description         |
| ---------- | ------ | ------------------- |
| `username` | string | Filter by username  |
| `email`    | string | Filter by the email |
| `role`     | string | Filter by role      |

- Response: `200`

```json
[
  {
    "id": 1,
    "username": "user_example",
    "email": "user_example@gmail.com",
    "phone": "8091234567",
    "role": "client"
  }
]
```

---

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

| Param     | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| `search`  | string | Filter by name                      |
| `isOpen`  | bool   | Filter by current open/closed state |
| `adminId` | int    | Filter by admin id                  |

- Response: `200`

```json
[
  {
    "id": 1,
    "adminId": 1,
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
  "adminId": 1,
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

### `GET /api/barbershops/{id}/dashboard` <!-- omit from toc -->

Get KPI summary for a specific barbershop.

- Response: `200`

```json
{
  "id": 1,
  "clientsToday": 8,
  "clientsThisWeek": 42,
  "clientsThisMonth": 163,
  "averageServiceMinutes": 28.5,
  "averageRating": 4.7,
  "totalReviews": 31,
  "activeBarbers": 2,
  "queueCount": 4
}
```

> `averageServiceMinutes` and `averageRating` are `null` when no data is available yet.

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

Replace the barbershop's main photo.

- Body

```json
{
  "photoUrl": "https://example.com/photo.jpg"
}
```

- Response: `200`

```json
{
  "message": "Barbershop photo updated"
}
```

---

### Barbershop Photos

### `GET /api/barbershops/{id}/photos` <!-- omit from toc -->

Get all photos of a barbershop.

- Response: `200`

```json
{
  "photos": [
    {
      "id": 1,
      "photoUrl": "https://example.com/photo_1.jpg"
    }
  ]
}
```

---

### `POST /api/barbershops/{id}/photos` <!-- omit from toc -->

Add one or more photos to the barbershop gallery.

- Body

```json
{
  "photoUrls": [
    "https://example.com/photo_1.jpg",
    "https://example.com/photo_2.jpg"
  ]
}
```

- Response: `201`

```json
{
  "uploaded": [
    {
      "id": 1,
      "photoUrl": "https://example.com/photo_1.jpg"
    },
    {
      "id": 2,
      "photoUrl": "https://example.com/photo_2.jpg"
    }
  ]
}
```

---

### `DELETE /api/barbershops/{id}/photos/{photoId}` <!-- omit from toc -->

Remove a photo from the gallery.

- Response: `204`

---

### Barbershop Reviews

### `GET /api/barbershops/{id}/reviews` <!-- omit from toc -->

List all reviews of a barbershop.

- Response: `200`

```json
[
  {
    "id": 1,
    "clientId": 1,
    "username": "user_example",
    "rating": 5,
    "content": "Great service, highly recommended.",
    "createdAt": "2026-03-05 09:00:00"
  }
]
```

---

### `POST /api/barbershops/{id}/reviews` <!-- omit from toc -->

Submit a review for a barbershop.

- Body

```json
{
  "clientId": 1,
  "rating": 5,
  "content": "Great service, highly recommended."
}
```

- Response: `201`

```json
{
  "id": 1,
  "clientId": 1,
  "username": "user_example",
  "rating": 5,
  "content": "Great service, highly recommended.",
  "createdAt": "2026-03-05 09:00:00"
}
```

---

### `DELETE /api/barbershops/{id}/reviews/{reviewId}` <!-- omit from toc -->

Remove a review from a barbershop's reviews.

- Response: `204`

---

### Barbershop Employees

### `GET /api/barbershops/{id}/employees` <!-- omit from toc -->

Retrieve all employees currently assigned to a specific barbershop.

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

---

### `POST /api/barbershops/{id}/employees` <!-- omit from toc -->

Create a new user and create their assignment record for the barbershop.

- Body

```json
{
  "username": "new_employee",
  "email": "new_employee@gmail.com",
  "phone": "8091234567",
  "password": "12345678",
  "role": "barber",
  "startTime": "08:00:00",
  "endTime": "16:00:00",
  "workingDays": [1, 2, 3, 4, 5]
}
```

> `role` must be one of: `barber`, `assistant`

- Response: `201`

```json
{
  "id": 1,
  "username": "new_employee",
  "email": "new_employee@gmail.com",
  "role": "barber"
}
```

---

### `POST /api/barbershops/{id}/employees/{employeeId}` <!-- omit from toc -->

Assign an existing employee to a barbershop with a work schedule.

- Body

```json
{
  "startTime": "08:00:00",
  "endTime": "16:00:00",
  "workingDays": [1, 2, 3, 4, 5]
}
```

- Response: `200`

```json
{
  "message": "Employee assigned to barbershop"
}
```

---

### `DELETE /api/barbershops/{id}/employees/{employeeId}` <!-- omit from toc -->

Unassign an employee from a barbershop. The employee's user account remains active in the system.

- Response: `204`

---

### Barbershop Clients

### `GET /api/barbershops/{id}/clients` <!-- omit from toc -->

List all clients currently checked in at a barbershop.

- Response: `200`

```json
[
  {
    "clientId": 1,
    "currentStatus": "at_barbershop",
    "username": "client_example"
  }
]
```

---

### `POST /api/barbershops/{id}/clients/{clientId}` <!-- omit from toc -->

Check a client in to a barbershop. The client must have status `default` and the barbershop must be open. Afterwards, the client's status becomes `at_barbershop`.

- Response: `204`

---

### `DELETE /api/barbershops/{id}/clients/{clientId}` <!-- omit from toc -->

Check a client out of a barbershop. The client must have status `at_barbershop` or `paid`. Afterwards, the client's status becomes `default`.

- Response: `204`

---

## Employees

### `GET /api/employees/{id}` <!-- omit from toc -->

Returns profile and all barbershop assignments of an employee.

- Response: `200`

```json
{
  "id": 1,
  "username": "employee_example",
  "email": "employee_example@gmail.com",
  "phone": "8091234567",
  "role": "barber",
  "assignments": [
    {
      "barbershopId": 1,
      "startTime": "08:00:00",
      "endTime": "16:00:00",
      "workingDays": [1, 2, 3]
    },
    {
      "barbershopId": 2,
      "startTime": "08:00:00",
      "endTime": "16:00:00",
      "workingDays": [4, 5, 6]
    }
  ]
}
```

---

### `PATCH /api/employees/{id}/barbershop/{barbershopId}` <!-- omit from toc -->

Updates a specific assignment's schedule. All fields are optional, but at least one must be provided.

- Body

```json
{
  "role": "barber",
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "workingDays": [1, 2, 3]
}
```

> `role` must be one of: `barber`, `assistant`

- Response: `200`

```json
{
  "message": "Employee updated"
}
```

---

### `DELETE /api/employees/{id}` <!-- omit from toc -->

Permanently removes the user and all associated staff assignments.

- Response: `204`

---

## Barbers

### `GET /api/barbers/{id}` <!-- omit from toc -->

Returns work profile of a barber.

- Response: `200`

```json
{
  "id": 1,
  "username": "barber_example",
  "currentStatus": "active",
  "isAccepting": true
}
```

---

### `GET /api/barbers/{id}/dashboard` <!-- omit from toc -->

Returns summary stats for a barber's dashboard.

- Response: `200`

```json
{
  "totalAttendedClients": 142,
  "averageServiceMinutes": 22.25,
  "averageRating": 4.7,
  "joinDate": "2026-01-01 09:00:00"
}
```

---

### `PATCH /api/barbers/{id}/status` <!-- omit from toc -->

Update a barber's current status. All fields are optional, but at least one must be provided.

- Body

```json
{
  "currentStatus": "resting",
  "isAccepting": false
}
```

> `currentStatus` must be one of: `active`, `inactive`, `resting`

- Response: `200`

```json
{
  "message": "Barber status updated"
}
```

---

### Barber Reviews

### `GET /api/barbers/{id}/reviews` <!-- omit from toc -->

List all reviews for a barber.

- Response: `200`

```json
[
  {
    "id": 1,
    "clientId": 1,
    "username": "client_example",
    "rating": 5,
    "content": "Great haircut, very precise.",
    "createdAt": "2026-03-05 09:00:00"
  }
]
```

---

### `POST /api/barbers/{id}/reviews` <!-- omit from toc -->

Submit a review for a barber.

- Body

```json
{
  "clientId": 1,
  "rating": 5,
  "content": "Great haircut, very precise."
}
```

- Response: `201`

```json
{
  "id": 1,
  "clientId": 1,
  "username": "client_example",
  "rating": 5,
  "content": "Great haircut, very precise.",
  "createdAt": "2026-03-05 09:00:00"
}
```

---

### `DELETE /api/barbers/{id}/reviews/{reviewId}` <!-- omit from toc -->

Remove a review from a barber's reviews.

- Response: `204`

---

## Clients

### `GET /api/clients/{id}/turn` <!-- omit from toc -->

Fetch the active turn for a specific client. If the client is a group leader, the response includes an array of all member turns under the `group` key.

- Response: `200`

```json
{
  "id": 1,
  "barbershopId": 1,
  "clientId": 1,
  "barberId": 1,
  "username": "client_example",
  "status": "in_service",
  "position": 1,
  "absolutePosition": 1,
  "estimatedTime": 0.0,
  "estimatedGroupTime": null,
  "createdAt": "2026-03-18 10:00:00",
  "group": null
}
```

With group (leader):

```json
{
  "id": 1,
  "barbershopId": 1,
  "clientId": 1,
  "barberId": 1,
  "username": "client_example",
  "status": "in_service",
  "position": 1,
  "absolutePosition": 1,
  "estimatedTime": 0.0,
  "estimatedGroupTime": 20.0,
  "createdAt": "2026-03-18 10:00:00",
  "group": {
    "groupId": 1,
    "members": [
      {
        "id": 2,
        "memberId": 1,
        "memberName": "member_example",
        "barberId": null,
        "position": 2,
        "absolutePosition": 2,
        "estimatedTime": 20.0,
        "status": "on_queue"
      }
    ]
  }
}
```

---

## Group Members

### `GET /api/group-members/{id}/turn` <!-- omit from toc -->

Fetch the active turn for a specific group member.

- Response: `200`

```json
{
  "id": 2,
  "barbershopId": 1,
  "memberId": 1,
  "barberId": 1,
  "groupId": 1,
  "memberName": "member_example",
  "status": "on_queue",
  "position": 2,
  "absolutePosition": 2,
  "estimatedTime": 20.0,
  "createdAt": "2026-03-18 10:00:00"
}
```

---

## Queues

### `GET /api/queues/barbershop/{barbershopId}` <!-- omit from toc -->

Shows all active barbers at a barbershop and their queues. Turns with no assigned barber are scheduled to the barber with the shortest estimated finish time on each request.

- Response: `200`

```json
[
  {
    "barberId": 1,
    "barberName": "barber_example",
    "barberStatus": "active",
    "isAccepting": true,
    "turns": [
      {
        "id": 1,
        "ownerId": 1,
        "groupId": null,
        "barberId": 1,
        "ownerName": "client_example",
        "ownerType": "client",
        "ownerStatus": "in_service",
        "position": 1,
        "absolutePosition": 1,
        "estimatedTime": 0.0,
        "groupSize": null
      }
    ]
  }
]
```

> `ownerType` is guaranteed to be one of the following: `client`, `member`.

---

### `GET /api/queues/barber/{barberId}` <!-- omit from toc -->

The barber's personal queue view. Shows the same turn data as the barbershop queue but filtered to a single barber.

- Response: `200`

```json
{
  "barberId": 1,
  "barberName": "barber_example",
  "barberStatus": "active",
  "isAccepting": true,
  "turns": [
    {
      "id": 1,
      "ownerId": 1,
      "groupId": null,
      "barberId": 1,
      "ownerName": "client_example",
      "ownerType": "client",
      "ownerStatus": "in_service",
      "position": 1,
      "absolutePosition": 1,
      "estimatedTime": 0.0,
      "groupSize": null
    }
  ]
}
```

---

## Turns

### `GET /api/turns/{id}` <!-- omit from toc -->

Fetch a specific turn's details.

- Response: `200`

```json
{
  "id": 1,
  "ownerId": 1,
  "barbershopId": 1,
  "groupId": null,
  "barberId": 1,
  "ownerName": "client_example",
  "ownerType": "client",
  "ownerStatus": "in_service",
  "position": 1,
  "absolutePosition": 1,
  "estimatedTime": 0.0,
  "groupSize": null,
  "createdAt": "2026-03-18 10:00:00",
  "attendedAt": null,
  "finishedAt": null
}
```

> `ownerType` is guaranteed to be one of the following: `client`, `member`.

---

### `POST /api/turns` <!-- omit from toc -->

Creates a turn for a client. The client must have status `at_barbershop`. Afterwards, the client's status becomes `on_queue`. If the created turn is immediately at position 1, the owner's status becomes `in_service` instead.

If `groupMembers` is provided, a group is created with the client as the leader and each name becomes an independent turn.

If `barberId` is omitted, the system auto-assigns each turn to the barber with the shortest estimated queue.

- Body

```json
{
  "clientId": 1,
  "barbershopId": 1,
  "barberId": 1,
  "groupMembers": [
    {
      "barberId": 2,
      "memberName": "member_example"
    }
  ]
}
```

- Response: `201`

```json
[
  {
    "id": 1,
    "ownerId": 1,
    "barbershopId": 1,
    "groupId": 1,
    "barberId": 1,
    "ownerName": "client_example",
    "ownerType": "client",
    "ownerStatus": "in_service",
    "position": 1,
    "absolutePosition": 1,
    "estimatedTime": 0.0,
    "groupSize": 2,
    "createdAt": "2026-03-18 10:00:00",
    "attendedAt": null,
    "finishedAt": null
  },
  {
    "id": 2,
    "ownerId": 1,
    "barbershopId": 1,
    "groupId": 1,
    "barberId": 1,
    "ownerName": "member_example",
    "ownerType": "member",
    "ownerStatus": "on_queue",
    "position": 2,
    "absolutePosition": 2,
    "estimatedTime": 20.0,
    "groupSize": 2,
    "createdAt": "2026-03-18 10:00:00",
    "attendedAt": null,
    "finishedAt": null
  }
]
```

---

### `DELETE /api/turns/{id}` <!-- omit from toc -->

Deletes a turn. The status restoration depends on who owns the turn:

| Owner  | Current status                          | Result                                 |
| ------ | --------------------------------------- | -------------------------------------- |
| Client | `waiting`                               | Client status becomes `default`.       |
| Client | `on_queue` or `in_service`              | Client status becomes `at_barbershop`. |
| Member | `on_queue` or `waiting` or `in_service` | Member record deleted.                 |

If the client is a **group leader**, the entire group is cancelled: all member turns are
deleted and all member records are removed.

After deletion, the next eligible `on_queue` turn in each affected barber queue is
promoted to `in_service`.

- Response: `204`

---

### `PATCH /api/turns/{id}/wait` <!-- omit from toc -->

Mark a turn owner as temporarily absent. Only `on_queue` turns can trigger this. Afterwards, the owner's status becomes `waiting` and their turn is preserved in the queue at its current position.

While waiting, the owner is skipped if they reach position 1, the next `on_queue` turn behind them moves to `in_service` instead.

- Response: `200`

```json
{
  "id": 2,
  "ownerId": 2,
  "barbershopId": 1,
  "groupId": null,
  "barberId": null,
  "ownerName": "client_example",
  "ownerType": "client",
  "ownerStatus": "waiting",
  "position": 2,
  "absolutePosition": 2,
  "estimatedTime": 20.0,
  "groupSize": null,
  "createdAt": "2026-03-18 10:00:00",
  "attendedAt": null,
  "finishedAt": null
}
```

---

### `PATCH /api/turns/{id}/unwait` <!-- omit from toc -->

Mark a waiting turn owner as present again. Only `waiting` turns can trigger this. Afterwards, the owner's status becomes `on_queue` and they re-enter the queue at their original position.

If they re-enter at position 1 and no one is currently `in_service` for their barber, they are immediately promoted to `in_service`.

- Response: `200`

```json
{
  "id": 2,
  "ownerId": 2,
  "barbershopId": 1,
  "groupId": null,
  "barberId": 1,
  "ownerName": "client_example",
  "ownerType": "client",
  "ownerStatus": "in_service",
  "position": 1,
  "absolutePosition": 1,
  "estimatedTime": 0.0,
  "groupSize": null,
  "createdAt": "2026-03-18 10:00:00",
  "attendedAt": null,
  "finishedAt": null
}
```

---

### `PATCH /api/turns/{id}/attend` <!-- omit from toc -->

Mark a turn as attended. Only turns whose owner has status `in_service` can be attended. Afterwards, the owner's status becomes `attended` and `turns.attended_at` is set.

After marking the turn as attended, the server promotes the next eligible turn in that barber's queue to `in_service`.

- Response: `200`

```json
{
  "id": 1,
  "ownerId": 1,
  "barbershopId": 1,
  "groupId": null,
  "barberId": 1,
  "ownerName": "client_example",
  "ownerType": "client",
  "ownerStatus": "attended",
  "position": null,
  "absolutePosition": null,
  "estimatedTime": null,
  "groupSize": null,
  "createdAt": "2026-03-18 10:00:00",
  "attendedAt": "2026-03-18 10:25:00",
  "finishedAt": null
}
```

---

### `PATCH /api/turns/{id}/pay` <!-- omit from toc -->

Mark a turn as paid and close it. Only client turns can trigger this, member turns cannot pay independently.

**Solo client:** Must have status `attended`. Afterwards, the client's status becomes `paid` and `turns.finished_at` is set.

**Group leader:** Can only pay if **all** group member turns also have status `attended`. Afterwards, the leader's and all members' statuses become `paid`, and `turns.finished_at` is set on all turns in the group.

- Response: `200`

```json
{
  "id": 1,
  "ownerId": 1,
  "barbershopId": 1,
  "groupId": null,
  "barberId": 1,
  "ownerName": "client_example",
  "ownerType": "client",
  "ownerStatus": "paid",
  "position": null,
  "absolutePosition": null,
  "estimatedTime": null,
  "groupSize": null,
  "createdAt": "2026-03-18 10:00:00",
  "attendedAt": "2026-03-18 10:25:00",
  "finishedAt": "2026-03-18 10:30:00"
}
```
