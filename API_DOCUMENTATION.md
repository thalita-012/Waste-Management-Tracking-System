# Waste Management Tracking System API Documentation

## Overview

This project exposes a REST API for authentication, truck tracking, notifications, payments, and basic server checks.

The backend runs on port `3000` by default.

## Base URLs

- Local backend: `http://localhost:3000`

## Authentication

Protected endpoints require this header:

```http
Authorization: Bearer <token>
```

The token is returned by the login endpoint.

## Endpoints

### 1. Register User

- Method: `POST`
- Path: `/api/auth/register`
- Auth: No

Creates a new user account.

#### Request body

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone_number": "0123456789",
  "address": "Bangkok",
  "latitude": 13.7563,
  "longitude": 100.5018
}
```

#### Required fields

- `full_name`
- `email`
- `password`

#### Success response

- Status: `201 Created`

```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "jwt-token-here",
  "user": {}
}
```

#### Common errors

- `400 Bad Request` if required fields are missing
- `400 Bad Request` if the email is already registered

The service returns:

- `message: "User already exists"`
- `error: "Email is already registered"`

---

### 2. Login

- Method: `POST`
- Path: `/api/auth/login`
- Auth: No

Logs in a user and returns a token.

#### Request body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Required fields

- `email`
- `password`

#### Success response

- Status: `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {}
}
```

#### Common errors

- `400 Bad Request` if fields are missing
- `401 Unauthorized` if credentials are invalid

The service returns these login failure messages:

- `message: "We could not find an account for this email. Create an account to get started."`
- `message: "The password does not match this account. Please try again."`

---

### 3. Forgot Password

- Method: `POST`
- Path: `/api/auth/forgot-password`
- Auth: No

Requests a password reset token for the given email.

#### Request body

```json
{
  "email": "john@example.com"
}
```

#### Required fields

- `email`

#### Success response

- Status: `200 OK`

```json
{
  "success": true,
  "message": "Password reset token created successfully",
  "token": "reset-token-here",
  "user": {
    "email": "john@example.com"
  }
}
```

#### Common errors

- `400 Bad Request` if email is missing

If the email does not exist, the service returns:

- `success: false`
- `message: "If a matching account exists, a reset token has been sent."`

---

### 4. Reset Password

- Method: `POST`
- Path: `/api/auth/reset-password`
- Auth: No

Resets a password using a reset token.

#### Request body

```json
{
  "token": "reset-token-here",
  "password": "newPassword123"
}
```

#### Required fields

- `token`
- `password`

#### Success response

- Status: `200 OK`

```json
{
  "success": true,
  "message": "Password has been reset successfully",
  "user": {}
}
```

#### Common errors

- `400 Bad Request` if token or password is missing
- `400 Bad Request` if the token is invalid or expired

The service returns:

- `message: "Invalid or expired reset token"`
- `error: "Token invalid"`

---

### 5. Get Profile

- Method: `GET`
- Path: `/api/auth/profile`
- Auth: Yes

Returns the profile of the authenticated user.

#### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

#### Success response

- Status: `200 OK`

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "user": {}
}
```

#### Common errors

- `401 Unauthorized` if the token is missing or invalid
- `404 Not Found` if the user profile cannot be found

The service returns:

- `message: "User not found"`
- `error: "Unable to fetch profile"`

---

### 6. Update Profile

- Method: `PUT`
- Path: `/api/auth/profile`
- Auth: Yes

Updates the authenticated user profile.

#### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request body

```json
{
  "full_name": "John Doe",
  "phone_number": "0987654321",
  "address": "Chiang Mai",
  "latitude": 18.7883,
  "longitude": 98.9853
}
```

#### Fields

- All fields are optional
- You can send only the fields you want to change

#### Success response

- Status: `200 OK`

```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

#### Common errors

- `401 Unauthorized` if the token is missing or invalid
- `400 Bad Request` if the update fails

The service returns:

- `message: "User not found"`
- `error: "Unable to update profile"`

---

### 7. Health Check

- Method: `GET`
- Path: `/health`
- Auth: No

Checks whether the server is running.

#### Success response

- Status: `200 OK`

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

### 8. Database Test

- Method: `GET`
- Path: `/db-test`
- Auth: No

Checks whether the backend can connect to the database.

#### Success response

- Status: `200 OK`

```json
{
  "success": true,
  "message": "Database connected successfully"
}
```

#### Failure response

- Status: `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Database connection failed"
}
```

## Testing Order

1. `GET /health`
2. `GET /db-test`
3. `POST /api/auth/register`
4. `POST /api/auth/login`
5. `GET /api/auth/profile`
6. `PUT /api/auth/profile`
7. `POST /api/auth/forgot-password`
8. `POST /api/auth/reset-password`

## Notes

- The backend source is in `src`.
- Payment, notification, and truck routes are mounted in `src/app.ts`.
- You can expand this document later with request/response examples taken from the real service output after testing the API.
