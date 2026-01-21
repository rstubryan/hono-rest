### API STANDARD

- Response Body Success

```json
{
  "code": 200,
  "status": "success",
  "message": "Data retrieved successfully",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_pages": 2,
      "total_results": 20
    }
  },
  "data": [{ "...": "..." }]
}
```

- Response Body Error

```json
{
  "code": 422,
  "status": "validation_error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

- Header Standard

```json
{
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Control-Max-Age": "600",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

- Cookie Standard

```json
{
  "Domain": "...domain",
  "Path": "/",
  "httpOnly": true,
  "Secure": true,
  "SameSite": "Lax",
  "Expires": "..."
}
```

- POST, PATCH, PUT

Authorization: Bearer ${token}

Use Cookie Standard + Header Standard

```json
{
  "...": ""
}
```

- DELETE (${id})

Authorization: Bearer ${token}

Use Cookie Standard + Header Standard
