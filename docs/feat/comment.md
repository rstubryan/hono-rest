# COMMENTS API

## Create Comment

POST /api/v1/articles/:articleId/comments

Authorization: Bearer ${token}

**Request Body:**

```json
{
  "content": "Great article! Very helpful.",
  "parent_id": null
}
```

**URL Parameters:**

- `articleId` (string): Article ID or slug

**Response Success (201):**

```json
{
  "code": 201,
  "status": "success",
  "message": "Comment created successfully",
  "data": {
    "id": "uuid-comment-id",
    "content": "Great article! Very helpful.",
    "article_id": "uuid-article-id",
    "parent_id": null,
    "status": "published",
    "user": {
      "id": "uuid-user-id",
      "name": "John Doe",
      "avatar": "https://example.com/avatars/john.jpg"
    },
    "like_count": 0,
    "reply_count": 0,
    "is_liked": false,
    "created_at": "2024-01-21T10:00:00Z",
    "updated_at": "2024-01-21T10:00:00Z"
  }
}
```

**Response Error (422):**

```json
{
  "code": 422,
  "status": "validation_error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "content",
      "message": "Content is required and must be between 3 and 1000 characters"
    },
    {
      "field": "article_id",
      "message": "Article not found"
    }
  ]
}
```

---

## List Comments

GET /api/v1/articles/:articleId/comments?page=1&limit=10&sort=latest

**URL Parameters:**

- `articleId` (string): Article ID or slug

**Query Parameters:**

| Parameter | Type    | Default   | Description                                      |
| --------- | ------- | --------- | ------------------------------------------------ |
| page      | integer | 1         | Page number                                      |
| limit     | integer | 10        | Items per page (max: 100)                        |
| sort      | string  | latest    | Sort by: latest, popular                         |
| parent_id | string  | null      | Filter by parent comment ID (null for top-level) |
| status    | string  | published | Filter by status: published, pending, spam       |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Comments retrieved successfully",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_pages": 5,
      "total_results": 50
    }
  },
  "data": [
    {
      "id": "uuid-comment-id",
      "content": "Great article! Very helpful.",
      "article_id": "uuid-article-id",
      "parent_id": null,
      "status": "published",
      "user": {
        "id": "uuid-user-id",
        "name": "John Doe",
        "avatar": "https://example.com/avatars/john.jpg"
      },
      "like_count": 12,
      "reply_count": 3,
      "is_liked": true,
      "created_at": "2024-01-21T10:00:00Z",
      "updated_at": "2024-01-21T10:00:00Z",
      "replies": [
        {
          "id": "uuid-reply-id",
          "content": "Thanks for the feedback!",
          "user": {
            "id": "uuid-author-id",
            "name": "Article Author",
            "avatar": "https://example.com/avatars/author.jpg"
          },
          "like_count": 5,
          "created_at": "2024-01-21T10:30:00Z"
        }
      ]
    }
  ]
}
```

---

## Get Comment Detail

GET /api/v1/comments/:id

**URL Parameters:**

- `id` (string): Comment ID

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Comment retrieved successfully",
  "data": {
    "id": "uuid-comment-id",
    "content": "Great article! Very helpful.",
    "article_id": "uuid-article-id",
    "article": {
      "id": "uuid-article-id",
      "title": "Getting Started with Hono",
      "slug": "getting-started-with-hono"
    },
    "parent_id": null,
    "parent": null,
    "status": "published",
    "user": {
      "id": "uuid-user-id",
      "name": "John Doe",
      "avatar": "https://example.com/avatars/john.jpg"
    },
    "like_count": 12,
    "reply_count": 3,
    "is_liked": true,
    "created_at": "2024-01-21T10:00:00Z",
    "updated_at": "2024-01-21T10:00:00Z",
    "replies": [
      {
        "id": "uuid-reply-id",
        "content": "Thanks for the feedback!",
        "user": {
          "id": "uuid-author-id",
          "name": "Article Author"
        },
        "like_count": 5,
        "created_at": "2024-01-21T10:30:00Z"
      }
    ]
  }
}
```

---

## Update Comment

PATCH /api/v1/comments/:id

Authorization: Bearer ${token} (Comment owner or Admin)

**Request Body:**

```json
{
  "content": "Updated comment content."
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Comment updated successfully",
  "data": {
    "id": "uuid-comment-id",
    "content": "Updated comment content.",
    "updated_at": "2024-01-21T11:00:00Z"
  }
}
```

**Response Error (403):**

```json
{
  "code": 403,
  "status": "forbidden",
  "message": "You don't have permission to update this comment",
  "errors": []
}
```

---

## Delete Comment

DELETE /api/v1/comments/:id

Authorization: Bearer ${token} (Comment owner or Admin)

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Comment deleted successfully",
  "data": {
    "id": "uuid-comment-id",
    "deleted_at": "2024-01-21T11:00:00Z"
  }
}
```

---

## Like Comment

POST /api/v1/comments/:id/like

Authorization: Bearer ${token}

**Response Success (201):**

```json
{
  "code": 201,
  "status": "success",
  "message": "Comment liked successfully",
  "data": {
    "comment_id": "uuid-comment-id",
    "like_count": 13,
    "is_liked": true
  }
}
```

---

## Unlike Comment

DELETE /api/v1/comments/:id/like

Authorization: Bearer ${token}

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Comment unliked successfully",
  "data": {
    "comment_id": "uuid-comment-id",
    "like_count": 12,
    "is_liked": false
  }
}
```

---

## Report Comment

POST /api/v1/comments/:id/report

Authorization: Bearer ${token}

**Request Body:**

```json
{
  "reason": "spam",
  "description": "This is spam content"
}
```

**Response Success (201):**

```json
{
  "code": 201,
  "status": "success",
  "message": "Comment reported successfully",
  "data": {
    "comment_id": "uuid-comment-id",
    "report_id": "uuid-report-id",
    "reason": "spam",
    "reported_at": "2024-01-21T11:00:00Z"
  }
}
```

---

## Moderation (Admin Only)

GET /api/v1/comments/moderation?page=1&limit=20&status=pending

Authorization: Bearer ${token} (Admin only)

**Query Parameters:**

| Parameter | Type    | Default | Description                                         |
| --------- | ------- | ------- | --------------------------------------------------- |
| page      | integer | 1       | Page number                                         |
| limit     | integer | 20      | Items per page                                      |
| status    | string  | pending | Filter by status: pending, approved, rejected, spam |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Moderation queue retrieved successfully",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total_pages": 3,
      "total_results": 50
    }
  },
  "data": [
    {
      "id": "uuid-comment-id",
      "content": "This might be spam...",
      "status": "pending",
      "user": {
        "id": "uuid-user-id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "article": {
        "id": "uuid-article-id",
        "title": "Getting Started with Hono"
      },
      "reports_count": 2,
      "created_at": "2024-01-21T10:00:00Z"
    }
  ]
}
```

---

## Moderate Comment (Admin Only)

PATCH /api/v1/comments/:id/moderate

Authorization: Bearer ${token} (Admin only)

**Request Body:**

```json
{
  "status": "approved",
  "reason": "Legitimate comment"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Comment moderated successfully",
  "data": {
    "id": "uuid-comment-id",
    "status": "approved",
    "moderated_at": "2024-01-21T11:00:00Z",
    "moderated_by": {
      "id": "uuid-admin-id",
      "name": "Admin User"
    }
  }
}
```
