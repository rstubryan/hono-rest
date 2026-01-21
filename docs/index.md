# Blog API Documentation

Complete API documentation for scalable Blog MVP backend built with Hono.

## Table of Contents

### Core Features

- [Authentication](./auth/user.md) - User auth, registration, login, profile management
- [RBAC](./auth/rbac.md) - Role-Based Access Control
- [Articles](./feat/article.md) - CRUD articles, search, trending, popular
- [Categories](./feat/category.md) - Category management with tree structure
- [Tags](./feat/tag.md) - Tag management
- [Rich Text Format](./feat/rich-text-format.md) - Content format specifications

### Engagement Features

- [Comments](./feat/comment.md) - Comment system with threaded replies
- [Interactions](./feat/interaction.md) - Likes, bookmarks, reading history

### Analytics

- [Analytics](./feat/analytics.md) - Article stats, dashboard analytics

### Standards

- [API Standards](./standard.md) - Response format, headers, cookies

## Quick Start

### Base URL

```
Production: https://api.example.com/api/v1
Development: http://localhost:3000/api/v1
```

### Authentication

Most endpoints require authentication using JWT bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Versioning

All endpoints are prefixed with version `/api/v1/` to ensure backward compatibility when introducing new features.

**Example:**

```
https://api.example.com/api/v1/articles
https://api.example.com/api/v1/auth/login
```

### Rate Limiting

- Public endpoints: 100 requests / 15 minutes
- Authenticated: 1000 requests / 15 minutes

### Response Format

All responses follow the standard format defined in [standard.md](./standard.md):

**Success Response:**

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
  "data": []
}
```

**Error Response:**

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

## API Endpoints Overview

### Authentication

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
PATCH  /api/v1/auth/me
POST   /api/v1/auth/me/password
POST   /api/v1/auth/me/avatar
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/resend-verification
```

### RBAC

```
GET    /api/v1/roles
GET    /api/v1/roles/:idOrName
POST   /api/v1/users/:userId/role
DELETE /api/v1/users/:userId/role
GET    /api/v1/auth/me/permissions
POST   /api/v1/auth/me/check-permission
```

### Articles

```
POST   /api/v1/articles
GET    /api/v1/articles
GET    /api/v1/articles/search
GET    /api/v1/articles/trending
GET    /api/v1/articles/popular
GET    /api/v1/articles/:idOrSlug
PATCH  /api/v1/articles/:id
DELETE /api/v1/articles/:id
PATCH  /api/v1/articles/:id/status
```

### Categories

```
POST   /api/v1/categories
GET    /api/v1/categories
GET    /api/v1/categories/tree
GET    /api/v1/categories/:idOrSlug
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

### Tags

```
POST   /api/v1/tags
GET    /api/v1/tags
GET    /api/v1/tags/popular
GET    /api/v1/tags/:idOrSlug
PATCH  /api/v1/tags/:id
DELETE /api/v1/tags/:id
POST   /api/v1/tags/:id/merge
```

### Comments

```
POST   /api/v1/articles/:articleId/comments
GET    /api/v1/articles/:articleId/comments
GET    /api/v1/comments/:id
PATCH  /api/v1/comments/:id
DELETE /api/v1/comments/:id
POST   /api/v1/comments/:id/like
DELETE /api/v1/comments/:id/like
POST   /api/v1/comments/:id/report
GET    /api/v1/comments/moderation (Admin)
PATCH  /api/v1/comments/:id/moderate (Admin)
```

### Interactions

```
POST   /api/v1/articles/:articleId/like
DELETE /api/v1/articles/:articleId/like
POST   /api/v1/articles/:articleId/bookmark
DELETE /api/v1/articles/:articleId/bookmark
GET    /api/v1/bookmarks
GET    /api/v1/liked-articles
GET    /api/v1/reading-history
POST   /api/v1/articles/:articleId/progress
POST   /api/v1/articles/:articleId/mark-read
POST   /api/v1/articles/:articleId/share
GET    /api/v1/articles/:articleId/share-stats
```

### Analytics

```
GET    /api/v1/analytics/articles/:articleId
GET    /api/v1/analytics/dashboard (Admin)
GET    /api/v1/analytics/realtime (Admin)
GET    /api/v1/analytics/export (Admin)
GET    /api/v1/analytics/search (Admin)
GET    /api/v1/analytics/my-stats (Author)
```

## User Roles

### Reader

- View published articles
- Like and bookmark articles
- Comment on articles
- Manage own profile

### Author

- All Reader permissions
- Create and manage own articles
- View article analytics
- Moderate comments on own articles

### Admin

- All Author permissions
- Manage all articles
- Manage categories and tags
- Moderate all comments
- Access dashboard analytics
- Export data

## Pagination

All list endpoints support pagination:

**Query Parameters:**

- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 10) - Items per page (max: 100)

**Response:**

```json
{
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_pages": 5,
      "total_results": 50
    }
  }
}
```

## Sorting

Common sorting options:

- `latest` - Sort by creation date (newest first)
- `oldest` - Sort by creation date (oldest first)
- `popular` - Sort by view count
- `trending` - Sort by trending score

## Filtering

Common filter parameters:

- `status` - Filter by status (published, draft, all)
- `category` - Filter by category slug
- `tag` - Filter by tag slug
- `author` - Filter by author ID
- `search` - Search query
- `date_from` - Filter by date range (start)
- `date_to` - Filter by date range (end)

## Error Codes

| Code | Status              | Description                   |
| ---- | ------------------- | ----------------------------- |
| 200  | success             | Request successful            |
| 201  | created             | Resource created successfully |
| 400  | bad_request         | Invalid request               |
| 401  | unauthorized        | Authentication required       |
| 403  | forbidden           | Permission denied             |
| 404  | not_found           | Resource not found            |
| 422  | validation_error    | Validation failed             |
| 429  | rate_limit_exceeded | Too many requests             |
| 500  | internal_error      | Server error                  |

## Support

For issues and questions, please contact:

- Email: support@example.com
- GitHub: https://github.com/example/blog-api
- Documentation: https://docs.example.com
