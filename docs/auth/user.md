# AUTH API

## Register

POST /api/v1/auth/register

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "password_confirmation": "SecurePassword123!"
}
```

**Response Success (201):**

```json
{
  "code": 201,
  "status": "SUCCESS",
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid-user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "reader",
      "avatar": "https://example.com/avatars/default.jpg",
      "email_verified": false,
      "created_at": "2024-01-20T10:00:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 900
    }
  }
}
```

**Response Error (422):**

```json
{
  "code": 422,
  "status": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters with uppercase, lowercase, and number"
    }
  ]
}
```

---

## Login

POST /api/v1/auth/login

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "remember_me": true
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "reader",
      "avatar": "https://example.com/avatars/john.jpg",
      "email_verified": true,
      "created_at": "2024-01-20T10:00:00Z",
      "last_login": "2024-01-21T10:00:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 900
    }
  }
}
```

**Response Error (401):**

```json
{
  "code": 401,
  "status": "UNAUTHORIZED",
  "message": "Invalid credentials",
  "errors": [
    {
      "field": "credentials",
      "message": "Email or password is incorrect"
    }
  ]
}
```

---

## Refresh Token

POST /api/v1/auth/refresh

**Request Body:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

**Response Error (401):**

```json
{
  "code": 401,
  "status": "UNAUTHORIZED",
  "message": "Invalid or expired refresh token",
  "errors": []
}
```

---

## Logout

POST /api/v1/auth/logout

Authorization: Bearer ${token}

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Logout successful",
  "data": {
    "logged_out_at": "2024-01-21T10:00:00Z"
  }
}
```

---

## Get Current User

GET /api/v1/auth/me

Authorization: Bearer ${token}

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "User profile retrieved successfully",
  "data": {
    "id": "uuid-user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "reader",
    "avatar": "https://example.com/avatars/john.jpg",
    "bio": "Full-stack developer passionate about TypeScript",
    "website": "https://johndoe.com",
    "twitter": "johndoe",
    "github": "johndoe",
    "email_verified": true,
    "stats": {
      "articles_count": 12,
      "comments_count": 45,
      "likes_given": 89,
      "bookmarks_count": 23
    },
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-21T10:00:00Z"
  }
}
```

**Response Error (401):**

```json
{
  "code": 401,
  "status": "UNAUTHORIZED",
  "message": "Unauthorized",
  "errors": []
}
```

---

## Update Profile

PATCH /api/v1/auth/me

Authorization: Bearer ${token}

**Request Body:**

```json
{
  "name": "John Doe Updated",
  "bio": "Updated bio",
  "website": "https://johndoe-updated.com",
  "twitter": "johndoe_updated",
  "github": "johndoe_updated"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid-user-id",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "bio": "Updated bio",
    "website": "https://johndoe-updated.com",
    "twitter": "johndoe_updated",
    "github": "johndoe_updated",
    "updated_at": "2024-01-21T10:00:00Z"
  }
}
```

---

## Change Password

POST /api/v1/auth/me/password

Authorization: Bearer ${token}

**Request Body:**

```json
{
  "current_password": "OldPassword123!",
  "password": "NewPassword456!",
  "password_confirmation": "NewPassword456!"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Password changed successfully",
  "data": {
    "updated_at": "2024-01-21T10:00:00Z"
  }
}
```

**Response Error (422):**

```json
{
  "code": 422,
  "status": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "current_password",
      "message": "Current password is incorrect"
    }
  ]
}
```

---

## Upload Avatar

POST /api/v1/auth/me/avatar

Authorization: Bearer ${token}

**Request Body:**

Content-Type: multipart/form-data

```
avatar: [file]
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar_url": "https://example.com/avatars/johndoe-updated.jpg",
    "size": 256732,
    "updated_at": "2024-01-21T10:00:00Z"
  }
}
```

**Response Error (422):**

```json
{
  "code": 422,
  "status": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "avatar",
      "message": "Avatar must be a valid image (jpg, png, webp) and max 2MB"
    }
  ]
}
```

---

## Forgot Password

POST /api/v1/auth/forgot-password

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Password reset email sent",
  "data": {
    "email": "john@example.com",
    "expires_in": 3600
  }
}
```

---

## Reset Password

POST /api/v1/auth/reset-password

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword456!",
  "password_confirmation": "NewPassword456!"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Password reset successful",
  "data": {
    "reset_at": "2024-01-21T10:00:00Z"
  }
}
```

---

## Verify Email

POST /api/v1/auth/verify-email

**Request Body:**

```json
{
  "token": "verification-token-from-email"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Email verified successfully",
  "data": {
    "email": "john@example.com",
    "verified_at": "2024-01-21T10:00:00Z"
  }
}
```

---

## Resend Verification Email

POST /api/v1/auth/resend-verification

Authorization: Bearer ${token}

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Verification email sent",
  "data": {
    "email": "john@example.com",
    "expires_in": 3600
  }
}
```
