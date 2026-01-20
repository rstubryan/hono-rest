# TAGS API

## Create Tag

POST /api/v1/tags

Authorization: Bearer ${token} (Admin only)

**Request Body:**

```json
{
  "name": "typescript",
  "description": "TypeScript related articles",
  "slug": "typescript",
  "color": "#3178c6",
  "meta_title": "TypeScript Articles",
  "meta_description": "Best TypeScript tutorials and articles"
}
```

**Response Success (201):**

```json
{
  "code": 201,
  "status": "SUCCESS",
  "message": "Tag created successfully",
  "data": {
    "id": "uuid-tag-id",
    "name": "typescript",
    "description": "TypeScript related articles",
    "slug": "typescript",
    "color": "#3178c6",
    "meta_title": "TypeScript Articles",
    "meta_description": "Best TypeScript tutorials and articles",
    "article_count": 0,
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z"
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
      "message": "Name is required and must be between 2 and 50 characters"
    },
    {
      "field": "slug",
      "message": "Slug must be unique"
    }
  ]
}
```

---

## List Tags

GET /api/v1/tags?page=1&limit=20&sort=popular

**Query Parameters:**

| Parameter | Type    | Default | Description                          |
| --------- | ------- | ------- | ------------------------------------ |
| page      | integer | 1       | Page number                          |
| limit     | integer | 20      | Items per page (max: 100)            |
| search    | string  | null    | Search in name and description       |
| sort      | string  | name    | Sort by: name, article_count, latest |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Tags retrieved successfully",
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
      "id": "uuid-tag-id",
      "name": "typescript",
      "description": "TypeScript related articles",
      "slug": "typescript",
      "color": "#3178c6",
      "article_count": 45,
      "created_at": "2024-01-20T10:00:00Z"
    },
    {
      "id": "uuid-tag-id",
      "name": "web-framework",
      "description": "Web framework tutorials",
      "slug": "web-framework",
      "color": "#ff6b6b",
      "article_count": 32,
      "created_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

## Get Tag Detail

GET /api/v1/tags/:idOrSlug

**URL Parameters:**

- `idOrSlug` (string): Tag ID or slug

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Tag retrieved successfully",
  "data": {
    "id": "uuid-tag-id",
    "name": "typescript",
    "description": "TypeScript related articles",
    "slug": "typescript",
    "color": "#3178c6",
    "meta_title": "TypeScript Articles",
    "meta_description": "Best TypeScript tutorials and articles",
    "article_count": 45,
    "latest_articles": [
      {
        "id": "uuid-article-id",
        "title": "Getting Started with Hono",
        "slug": "getting-started-with-hono",
        "excerpt": "Learn the basics of Hono framework",
        "featured_image": "https://example.com/images/hono-cover.jpg",
        "published_at": "2024-01-20T10:00:00Z"
      }
    ],
    "related_tags": [
      {
        "id": "uuid-tag-id",
        "name": "web-framework",
        "slug": "web-framework",
        "article_count": 32
      }
    ],
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z"
  }
}
```

**Response Error (404):**

```json
{
  "code": 404,
  "status": "NOT_FOUND",
  "message": "Tag not found",
  "errors": []
}
```

---

## Update Tag

PATCH /api/v1/tags/:id

Authorization: Bearer ${token} (Admin only)

**Request Body:**

```json
{
  "name": "TypeScript",
  "description": "Updated description",
  "color": "#2574c9",
  "meta_title": "Updated meta title",
  "meta_description": "Updated meta description"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Tag updated successfully",
  "data": {
    "id": "uuid-tag-id",
    "name": "TypeScript",
    "description": "Updated description",
    "slug": "typescript",
    "color": "#2574c9",
    "article_count": 45,
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-21T10:00:00Z"
  }
}
```

---

## Delete Tag

DELETE /api/v1/tags/:id

Authorization: Bearer ${token} (Admin only)

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Tag deleted successfully",
  "data": {
    "id": "uuid-tag-id",
    "deleted_at": "2024-01-21T10:00:00Z"
  }
}
```

**Response Error (400):**

```json
{
  "code": 400,
  "status": "BAD_REQUEST",
  "message": "Cannot delete tag with existing articles",
  "errors": [
    {
      "field": "tag",
      "message": "This tag is used in 45 articles. Remove the tag from articles first or use ?force=true"
    }
  ]
}
```

---

## Popular Tags

GET /api/v1/tags/popular?limit=20

**Query Parameters:**

| Parameter | Type    | Default | Description                    |
| --------- | ------- | ------- | ------------------------------ |
| limit     | integer | 20      | Number of tags                 |
| period    | string  | all     | Time period: 7d, 30d, 90d, all |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Popular tags retrieved successfully",
  "meta": {
    "period": "all"
  },
  "data": [
    {
      "id": "uuid-tag-id",
      "name": "typescript",
      "slug": "typescript",
      "color": "#3178c6",
      "article_count": 45
    },
    {
      "id": "uuid-tag-id",
      "name": "javascript",
      "slug": "javascript",
      "color": "#f7df1e",
      "article_count": 38
    }
  ]
}
```

---

## Merge Tags

POST /api/v1/tags/:id/merge

Authorization: Bearer ${token} (Admin only)

**Request Body:**

```json
{
  "target_tag_id": "uuid-target-tag-id",
  "delete_source": true
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Tags merged successfully",
  "data": {
    "source_tag": {
      "id": "uuid-source-tag-id",
      "name": "ts"
    },
    "target_tag": {
      "id": "uuid-target-tag-id",
      "name": "typescript",
      "slug": "typescript"
    },
    "articles_updated": 45,
    "source_tag_deleted": true
  }
}
```
