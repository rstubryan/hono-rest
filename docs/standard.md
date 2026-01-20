### API STANDARD

- Response Body Success (200)

```json
{
  "code": ""
  "status": ""
  "message": ""
  "data": []
}
```

- Response Body Error (500)

```json
{
  "code": ""
  "status": ""
  "message": ""
}
```

- Header Standard

```json
{
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Acces-Control-Allow-Method": "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Access-Control-Max-Age": "600"
}
```

- Cookie Standard

```json
{
  "Domain": "...domain",
  "Path": "/",
  "HttpOnlyCookie": true,
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
