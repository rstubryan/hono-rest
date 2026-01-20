# INTERACTIONS API

## Like Article

POST /api/v1/articles/:articleId/like

Authorization: Bearer ${token}

**URL Parameters:**

- `articleId` (string): Article ID or slug

**Response Success (201):**

```json
{
  "code": 201,
  "status": "SUCCESS",
  "message": "Article liked successfully",
  "data": {
    "article_id": "uuid-article-id",
    "like_count": 46,
    "is_liked": true,
    "liked_at": "2024-01-21T10:00:00Z"
  }
}
```

**Response Error (404):**

```json
{
  "code": 404,
  "status": "NOT_FOUND",
  "message": "Article not found",
  "errors": []
}
```

**Response Error (400):**

```json
{
  "code": 400,
  "status": "BAD_REQUEST",
  "message": "You already liked this article",
  "errors": []
}
```

---

## Unlike Article

DELETE /api/v1/articles/:articleId/like

Authorization: Bearer ${token}

**URL Parameters:**

- `articleId` (string): Article ID or slug

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Article unliked successfully",
  "data": {
    "article_id": "uuid-article-id",
    "like_count": 45,
    "is_liked": false
  }
}
```

---

## Bookmark Article

POST /api/v1/articles/:articleId/bookmark

Authorization: Bearer ${token}

**URL Parameters:**

- `articleId` (string): Article ID or slug

**Response Success (201):**

```json
{
  "code": 201,
  "status": "SUCCESS",
  "message": "Article bookmarked successfully",
  "data": {
    "article_id": "uuid-article-id",
    "is_bookmarked": true,
    "bookmarked_at": "2024-01-21T10:00:00Z"
  }
}
```

**Response Error (400):**

```json
{
  "code": 400,
  "status": "BAD_REQUEST",
  "message": "You already bookmarked this article",
  "errors": []
}
```

---

## Remove Bookmark

DELETE /api/v1/articles/:articleId/bookmark

Authorization: Bearer ${token}

**URL Parameters:**

- `articleId` (string): Article ID or slug

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Bookmark removed successfully",
  "data": {
    "article_id": "uuid-article-id",
    "is_bookmarked": false
  }
}
```

---

## List Bookmarked Articles

GET /api/v1/bookmarks?page=1&limit=10&sort=latest

Authorization: Bearer ${token}

**Query Parameters:**

| Parameter | Type    | Default | Description               |
| --------- | ------- | ------- | ------------------------- |
| page      | integer | 1       | Page number               |
| limit     | integer | 10      | Items per page (max: 100) |
| sort      | string  | latest  | Sort by: latest, oldest   |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Bookmarks retrieved successfully",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_pages": 3,
      "total_results": 25
    }
  },
  "data": [
    {
      "id": "uuid-bookmark-id",
      "article": {
        "id": "uuid-article-id",
        "title": "Getting Started with Hono",
        "slug": "getting-started-with-hono",
        "excerpt": "Learn the basics of Hono framework",
        "featured_image": "https://example.com/images/hono-cover.jpg",
        "author": {
          "id": "uuid-author-id",
          "name": "John Doe"
        },
        "category": {
          "id": "uuid-category-id",
          "name": "Programming",
          "slug": "programming"
        },
        "view_count": 1250,
        "like_count": 45,
        "comment_count": 12,
        "published_at": "2024-01-20T10:00:00Z"
      },
      "bookmarked_at": "2024-01-21T10:00:00Z"
    }
  ]
}
```

---

## List Liked Articles

GET /api/v1/liked-articles?page=1&limit=10&sort=latest

Authorization: Bearer ${token}

**Query Parameters:**

| Parameter | Type    | Default | Description               |
| --------- | ------- | ------- | ------------------------- |
| page      | integer | 1       | Page number               |
| limit     | integer | 10      | Items per page (max: 100) |
| sort      | string  | latest  | Sort by: latest, oldest   |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Liked articles retrieved successfully",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_pages": 2,
      "total_results": 15
    }
  },
  "data": [
    {
      "id": "uuid-like-id",
      "article": {
        "id": "uuid-article-id",
        "title": "Getting Started with Hono",
        "slug": "getting-started-with-hono",
        "excerpt": "Learn the basics of Hono framework",
        "featured_image": "https://example.com/images/hono-cover.jpg",
        "author": {
          "id": "uuid-author-id",
          "name": "John Doe"
        },
        "category": {
          "id": "uuid-category-id",
          "name": "Programming",
          "slug": "programming"
        },
        "view_count": 1250,
        "like_count": 45,
        "comment_count": 12,
        "published_at": "2024-01-20T10:00:00Z"
      },
      "liked_at": "2024-01-21T10:00:00Z"
    }
  ]
}
```

---

## Get Reading History

GET /api/v1/reading-history?page=1&limit=10

Authorization: Bearer ${token}

**Query Parameters:**

| Parameter | Type    | Default | Description               |
| --------- | ------- | ------- | ------------------------- |
| page      | integer | 1       | Page number               |
| limit     | integer | 10      | Items per page (max: 100) |
| days      | integer | 30      | Filter by last N days     |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Reading history retrieved successfully",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_pages": 5,
      "total_results": 50
    },
    "period": "last 30 days"
  },
  "data": [
    {
      "id": "uuid-view-id",
      "article": {
        "id": "uuid-article-id",
        "title": "Getting Started with Hono",
        "slug": "getting-started-with-hono",
        "excerpt": "Learn the basics of Hono framework",
        "featured_image": "https://example.com/images/hono-cover.jpg",
        "author": {
          "id": "uuid-author-id",
          "name": "John Doe"
        }
      },
      "viewed_at": "2024-01-21T10:00:00Z",
      "read_progress": 75
    }
  ]
}
```

---

## Track Reading Progress

POST /api/v1/articles/:articleId/progress

Authorization: Bearer ${token}

**Request Body:**

```json
{
  "progress": 75,
  "completed": false
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Reading progress updated",
  "data": {
    "article_id": "uuid-article-id",
    "progress": 75,
    "completed": false,
    "updated_at": "2024-01-21T10:00:00Z"
  }
}
```

---

## Mark as Read

POST /api/v1/articles/:articleId/mark-read

Authorization: Bearer ${token}

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Article marked as read",
  "data": {
    "article_id": "uuid-article-id",
    "marked_at": "2024-01-21T10:00:00Z"
  }
}
```

---

## Share Article

POST /api/v1/articles/:articleId/share

**Request Body:**

```json
{
  "platform": "twitter",
  "url": "https://twitter.com/intent/tweet?url=https://example.com/articles/getting-started-with-hono"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Share link generated",
  "data": {
    "platform": "twitter",
    "share_url": "https://twitter.com/intent/tweet?url=https://example.com/articles/getting-started-with-hono&text=Getting%20Started%20with%20Hono",
    "share_count": 12
  }
}
```

---

## Get Share Stats

GET /api/v1/articles/:articleId/share-stats

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Share statistics retrieved",
  "data": {
    "article_id": "uuid-article-id",
    "total_shares": 45,
    "shares_by_platform": {
      "twitter": 20,
      "facebook": 15,
      "linkedin": 8,
      "whatsapp": 2
    }
  }
}
```
