# AUTH API - MVP

Minimal authentication API untuk MVP menggunakan JWT dengan httpOnly cookies.

## Security Overview

**Tokens Storage:**

- ✅ **Access Token & Refresh Token** disimpan di httpOnly, Secure, SameSite cookies
- ✅ **Tidak di-expose** di response body
- ✅ **Tidak accessible** via JavaScript (httpOnly)
- ✅ **Dikirim otomatis** dengan setiap request ke API

**Cookie Configuration:**

```json
{
  "access_token": {
    "name": "access_token",
    "options": {
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax",
      "path": "/",
      "maxAge": 900 // 15 minutes
    }
  },
  "refresh_token": {
    "name": "refresh_token",
    "options": {
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax",
      "path": "/",
      "maxAge": 604800 // 7 days
    }
  }
}
```

---

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
      "avatar": null,
      "email_verified": false,
      "created_at": "2024-01-20T10:00:00Z"
    }
  }
}
```

**Response Headers:**

```http
Set-Cookie: access_token=<jwt_access_token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900
Set-Cookie: refresh_token=<jwt_refresh_token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800
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
  "password": "SecurePassword123!"
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
      "avatar": null,
      "email_verified": false,
      "created_at": "2024-01-20T10:00:00Z"
    }
  }
}
```

**Response Headers:**

```http
Set-Cookie: access_token=<jwt_access_token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900
Set-Cookie: refresh_token=<jwt_refresh_token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800
```

**Response Error (401):**

```json
{
  "code": 401,
  "status": "UNAUTHORIZED",
  "message": "Invalid credentials",
  "errors": []
}
```

---

## Refresh Token

POST /api/v1/auth/refresh

**Description:**

Refresh access token menggunakan refresh token dari cookie. Endpoint ini otomatis membaca refresh token dari httpOnly cookie dan mengeluarkan cookies baru.

**Request:**

Tidak perlu request body. Refresh token diambil otomatis dari cookie.

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Token refreshed successfully",
  "data": null
}
```

**Response Headers:**

```http
Set-Cookie: access_token=<new_jwt_access_token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900
Set-Cookie: refresh_token=<new_jwt_refresh_token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800
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

**Note:**

- Old refresh token di-revoke (dicantumkan di database)
- New refresh token di-generate (token rotation)

---

## Logout

POST /api/v1/auth/logout

**Description:**

Revoke refresh token dan clear cookies.

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Logout successful",
  "data": null
}
```

**Response Headers:**

```http
Set-Cookie: access_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0
Set-Cookie: refresh_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0
```

**Backend Actions:**

- Mark refresh token sebagai revoked di database
- Clear cookies dengan Max-Age=0

---

## Get Current User

GET /api/v1/auth/me

**Description:**

Get current user profile. Access token otomatis dikirim via cookie.

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
    "avatar": null,
    "bio": null,
    "email_verified": false,
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

**Request Body:**

```json
{
  "name": "John Doe Updated",
  "bio": "Updated bio"
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
      "field": "name",
      "message": "Name must be at least 2 characters"
    }
  ]
}
```

---

## Implementation Notes

### JWT Token Payload

**Access Token (15 minutes):**

```json
{
  "sub": "user-uuid",
  "email": "john@example.com",
  "type": "access",
  "iat": 1234567890,
  "exp": 1234568790
}
```

**Refresh Token (7 days):**

```json
{
  "sub": "user-uuid",
  "type": "refresh",
  "tokenId": "refresh-token-uuid",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Cookie Management (Frontend)

**Automatic:**

- Browser otomatis mengirim cookies dengan setiap request
- Tidak perlu manual header `Authorization: Bearer ${token}`
- Tidak perlu manage token storage di frontend

**Manual Token Handling (Optional):**
Jika butuh akses token manual (misal untuk WebSocket):

```typescript
// Server endpoint untuk get access token
GET /api/v1/auth/token

// Response
{
  "data": {
    "access_token": "eyJhbGci..."
  }
}
```

### Security Best Practices

1. **httpOnly Cookies** - Mencegah XSS attacks
2. **Secure Flag** - Hanya kirim via HTTPS
3. **SameSite=Lax** - Mencegah CSRF attacks
4. **Token Rotation** - Refresh token di-rotate setelah digunakan
5. **Short-lived Access Token** - 15 minutes expiration
6. **Long-lived Refresh Token** - 7 days expiration, bisa di-revoke
7. **Revocation Tracking** - Refresh token yang di-revoke disimpan di database

### CORS Configuration

Frontend harus mengizinkan credentials:

```typescript
// Frontend fetch example
fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  credentials: 'include', // Penting untuk cookies
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePassword123!',
  }),
})
```

Backend CORS configuration:

```typescript
app.use(
  '*',
  cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true, // Penting untuk cookies
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
)
```
