# ARTICLES API

## Create Article

POST /api/v1/articles

Authorization: Bearer ${token}

**Request Body:**

```json
{
  "title": "Getting Started with Hono",
  "content": "{\"ops\":[{\"insert\":\"Hono is a fast, lightweight web framework...\\n\"}]}",
  "content_type": "quill_delta",
  "excerpt": "Learn the basics of Hono framework",
  "featured_image": "https://example.com/images/hono-cover.jpg",
  "category_id": "uuid-category-id",
  "tag_ids": ["uuid-tag-1", "uuid-tag-2", "uuid-tag-3"],
  "status": "draft",
  "published_at": null
}
```

**Field Descriptions:**

| Field          | Type          | Required | Description                                                      |
| -------------- | ------------- | -------- | ---------------------------------------------------------------- |
| title          | string        | Yes      | Article title (10-200 characters)                                |
| content        | string/object | Yes      | Article content in Quill Delta format (JSON string or object)    |
| content_type   | string        | Yes      | Content format type: `quill_delta` (default), `markdown`, `html` |
| excerpt        | string        | No       | Short description (max 500 chars)                                |
| featured_image | string        | No       | Cover image URL                                                  |
| category_id    | string        | Yes      | Category UUID                                                    |
| tag_ids        | array         | No       | Array of tag UUIDs                                               |
| status         | string        | No       | Article status: `draft` (default), `published`                   |
| published_at   | string        | No       | ISO 8601 datetime (required when status=published)               |

**Quill Delta Format Example:**

````json
{
  "content": "{\"ops\":[{\"insert\":\"Getting Started with Hono\\n\",\"attributes\":{\"header\":1}},{insert\":\"Hono is a \",\"attributes\":{\"bold\":true}},{insert\":\"fast\",\"attributes\":{\"italic\":true,\"color\":\"#e60000\"}},{insert\":\" and lightweight web framework.\\n\\n\"},{insert\":\"## Installation\\n\",\"attributes\":{\"code-block\":true}},{insert\":\"```bash\\nnpm install hono\\n```\\n\"}]}"
}
````

**Content Storage Options:**

1. **Quill Delta (JSON)** - Recommended for editing

   ```json
   {
     "content": "{\"ops\":[{\"insert\":\"Hello World\\n\"}]}",
     "content_type": "quill_delta"
   }
   ```

2. **HTML** - For display purposes

   ```json
   {
     "content": "<p>Hello <strong>World</strong></p>",
     "content_type": "html"
   }
   ```

3. **Markdown** - Alternative format
   ```json
   {
     "content": "# Hello World\\n\\nThis is **bold** text.",
     "content_type": "markdown"
   }
   ```

**Response Success (201):**

```json
{
  "code": 201,
  "status": "success",
  "message": "Article created successfully",
  "data": {
    "id": "uuid-article-id",
    "title": "Getting Started with Hono",
    "slug": "getting-started-with-hono",
    "content": "{\"ops\":[{\"insert\":\"Hono is a fast, lightweight web framework...\\n\"}]}",
    "content_type": "quill_delta",
    "content_html": "<p>Hono is a fast, lightweight web framework...</p>",
    "content_plain": "Hono is a fast, lightweight web framework...",
    "excerpt": "Learn the basics of Hono framework",
    "featured_image": "https://example.com/images/hono-cover.jpg",
    "status": "draft",
    "author": {
      "id": "uuid-author-id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatars/john.jpg"
    },
    "category": {
      "id": "uuid-category-id",
      "name": "Programming",
      "slug": "programming"
    },
    "tags": [
      {
        "id": "uuid-tag-id",
        "name": "typescript",
        "slug": "typescript"
      },
      {
        "id": "uuid-tag-id",
        "name": "web-framework",
        "slug": "web-framework"
      }
    ],
    "word_count": 156,
    "reading_time": 5,
    "view_count": 0,
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z",
    "published_at": null
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
      "field": "title",
      "message": "Title is required and must be between 10 and 200 characters"
    },
    {
      "field": "content",
      "message": "Content is required"
    },
    {
      "field": "category_id",
      "message": "Category not found"
    }
  ]
}
```

---

## List Articles

GET /api/v1/articles?page=1&limit=10&status=published&category=programming&tag=typescript&author=uuid&sort=latest

**Query Parameters:**

| Parameter | Type    | Default   | Description                             |
| --------- | ------- | --------- | --------------------------------------- |
| page      | integer | 1         | Page number                             |
| limit     | integer | 10        | Items per page (max: 100)               |
| status    | string  | published | Filter by status: draft, published, all |
| category  | string  | null      | Filter by category slug                 |
| tag       | string  | null      | Filter by tag slug                      |
| author    | string  | null      | Filter by author ID                     |
| search    | string  | null      | Search in title and content             |
| sort      | string  | latest    | Sort by: latest, popular, trending      |
| featured  | boolean | null      | Filter featured articles only           |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Articles retrieved successfully",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_pages": 5,
      "total_results": 50
    },
    "filters": {
      "status": "published",
      "category": "programming",
      "tag": "typescript",
      "sort": "latest"
    }
  },
  "data": [
    {
      "id": "uuid-article-id",
      "title": "Getting Started with Hono",
      "slug": "getting-started-with-hono",
      "excerpt": "Learn the basics of Hono framework",
      "featured_image": "https://example.com/images/hono-cover.jpg",
      "content_preview": "Hono is a fast, lightweight web framework...",
      "status": "published",
      "author": {
        "id": "uuid-author-id",
        "name": "John Doe",
        "avatar": "https://example.com/avatars/john.jpg"
      },
      "category": {
        "id": "uuid-category-id",
        "name": "Programming",
        "slug": "programming"
      },
      "tags": [
        {
          "id": "uuid-tag-id",
          "name": "typescript",
          "slug": "typescript"
        }
      ],
      "view_count": 1250,
      "like_count": 45,
      "comment_count": 12,
      "created_at": "2024-01-20T10:00:00Z",
      "updated_at": "2024-01-20T10:00:00Z",
      "published_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

## Get Article Detail

GET /api/v1/articles/:idOrSlug

**URL Parameters:**

- `idOrSlug` (string): Article ID or slug

**Response Success (200):**

````json
{
  "code": 200,
  "status": "success",
  "message": "Article retrieved successfully",
  "data": {
    "id": "uuid-article-id",
    "title": "Getting Started with Hono",
    "slug": "getting-started-with-hono",
    "content": "{\"ops\":[{\"insert\":\"Hono is a fast, lightweight web framework...\\n\\n\",\"attributes\":{\"header\":1}},{insert\":\"## Installation\\n\",\"attributes\":{\"code-block\":true}},{insert\":\"```bash\\nnpm install hono\\n```\\n\"}]}",
    "content_type": "quill_delta",
    "content_html": "<h1>Hono is a fast, lightweight web framework...</h1><h2>Installation</h2><pre><code>```bash\nnpm install hono\n```\n</code></pre>",
    "content_plain": "Hono is a fast, lightweight web framework...\\n\\n## Installation\\n```bash\\nnpm install hono\\n```",
    "excerpt": "Learn the basics of Hono framework",
    "featured_image": "https://example.com/images/hono-cover.jpg",
    "status": "published",
    "author": {
      "id": "uuid-author-id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatars/john.jpg",
      "bio": "Full-stack developer passionate about TypeScript"
    },
    "category": {
      "id": "uuid-category-id",
      "name": "Programming",
      "slug": "programming",
      "description": "Programming tutorials and articles"
    },
    "tags": [
      {
        "id": "uuid-tag-id",
        "name": "typescript",
        "slug": "typescript"
      },
      {
        "id": "uuid-tag-id",
        "name": "web-framework",
        "slug": "web-framework"
      },
      {
        "id": "uuid-tag-id",
        "name": "tutorial",
        "slug": "tutorial"
      }
    ],
    "view_count": 1250,
    "like_count": 45,
    "comment_count": 12,
    "is_liked": false,
    "is_bookmarked": false,
    "reading_time": 5,
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z",
    "published_at": "2024-01-20T10:00:00Z",
    "related_articles": [
      {
        "id": "uuid-article-id",
        "title": "Advanced Hono Patterns",
        "slug": "advanced-hono-patterns",
        "excerpt": "Deep dive into Hono's advanced features",
        "featured_image": "https://example.com/images/advanced-hono.jpg"
      }
    ]
  }
}
````

**Response Error (404):**

```json
{
  "code": 404,
  "status": "not_found",
  "message": "Article not found",
  "errors": []
}
```

---

## Update Article

PATCH /api/v1/articles/:id

Authorization: Bearer ${token}

**Request Body:**

```json
{
  "title": "Getting Started with Hono - Updated Edition",
  "content": "{\"ops\":[{\"insert\":\"Updated content...\\n\"}]}",
  "content_type": "quill_delta",
  "excerpt": "Updated excerpt",
  "featured_image": "https://example.com/images/new-cover.jpg",
  "category_id": "uuid-new-category-id",
  "tag_ids": ["uuid-tag-1", "uuid-tag-2"],
  "status": "published",
  "published_at": "2024-01-21T10:00:00Z"
}
```

**Tags Update Behavior:**

When updating, `tag_ids` will **replace** all existing tags (not merged):

```json
// Before: ["uuid-tag-1", "uuid-tag-2"]
// Request: { "tag_ids": ["uuid-tag-3", "uuid-tag-4"] }
// After: ["uuid-tag-3", "uuid-tag-4"] (replaced)
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Article updated successfully",
  "data": {
    "id": "uuid-article-id",
    "title": "Getting Started with Hono - Updated Edition",
    "slug": "getting-started-with-hono-updated-edition",
    "content": "{\"ops\":[{\"insert\":\"Updated content...\\n\"}]}",
    "content_type": "quill_delta",
    "content_html": "<p>Updated content...</p>",
    "content_plain": "Updated content...",
    "excerpt": "Updated excerpt",
    "featured_image": "https://example.com/images/new-cover.jpg",
    "status": "published",
    "author": {
      "id": "uuid-author-id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "category": {
      "id": "uuid-new-category-id",
      "name": "Web Development",
      "slug": "web-development"
    },
    "tags": [
      {
        "id": "uuid-tag-id",
        "name": "typescript",
        "slug": "typescript"
      }
    ],
    "view_count": 1250,
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-21T10:00:00Z",
    "published_at": "2024-01-21T10:00:00Z"
  }
}
```

**Response Error (403):**

```json
{
  "code": 403,
  "status": "forbidden",
  "message": "You don't have permission to update this article",
  "errors": []
}
```

**Response Error (404):**

```json
{
  "code": 404,
  "status": "not_found",
  "message": "Article not found",
  "errors": []
}
```

---

## Delete Article

DELETE /api/v1/articles/:id

Authorization: Bearer ${token}

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Article deleted successfully",
  "data": {
    "id": "uuid-article-id",
    "deleted_at": "2024-01-21T10:00:00Z"
  }
}
```

**Response Error (403):**

```json
{
  "code": 403,
  "status": "forbidden",
  "message": "You don't have permission to delete this article",
  "errors": []
}
```

---

## Publish/Unpublish Article

PATCH /api/v1/articles/:id/status

Authorization: Bearer ${token} (Admin only)

**Request Body:**

```json
{
  "status": "published",
  "published_at": "2024-01-21T10:00:00Z"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Article status updated successfully",
  "data": {
    "id": "uuid-article-id",
    "status": "published",
    "published_at": "2024-01-21T10:00:00Z"
  }
}
```

---

## Search Articles

GET /api/v1/articles/search?q=hono framework&page=1&limit=10

**Query Parameters:**

| Parameter | Type    | Default  | Description             |
| --------- | ------- | -------- | ----------------------- |
| q         | string  | required | Search query            |
| page      | integer | 1        | Page number             |
| limit     | integer | 10       | Items per page          |
| category  | string  | null     | Filter by category slug |
| tag       | string  | null     | Filter by tag slug      |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Search results retrieved successfully",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_pages": 3,
      "total_results": 25
    },
    "search": {
      "query": "hono framework",
      "took": 45
    }
  },
  "data": [
    {
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
      "created_at": "2024-01-20T10:00:00Z",
      "published_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

## Trending Articles

GET /api/v1/articles/trending?period=7d&limit=10

**Query Parameters:**

| Parameter | Type    | Default | Description                   |
| --------- | ------- | ------- | ----------------------------- |
| period    | string  | 7d      | Time period: 1d, 7d, 30d, 90d |
| limit     | integer | 10      | Number of articles            |
| category  | string  | null    | Filter by category slug       |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Trending articles retrieved successfully",
  "meta": {
    "period": "7d",
    "generated_at": "2024-01-21T10:00:00Z"
  },
  "data": [
    {
      "id": "uuid-article-id",
      "title": "Getting Started with Hono",
      "slug": "getting-started-with-hono",
      "excerpt": "Learn the basics of Hono framework",
      "featured_image": "https://example.com/images/hono-cover.jpg",
      "author": {
        "id": "uuid-author-id",
        "name": "John Doe"
      },
      "view_count": 1250,
      "trending_score": 89.5,
      "created_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

## Popular Articles

GET /api/v1/articles/popular?period=30d&limit=10

**Query Parameters:**

| Parameter | Type    | Default | Description                    |
| --------- | ------- | ------- | ------------------------------ |
| period    | string  | 30d     | Time period: 7d, 30d, 90d, all |
| limit     | integer | 10      | Number of articles             |
| category  | string  | null    | Filter by category slug        |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Popular articles retrieved successfully",
  "meta": {
    "period": "30d"
  },
  "data": [
    {
      "id": "uuid-article-id",
      "title": "Getting Started with Hono",
      "slug": "getting-started-with-hono",
      "excerpt": "Learn the basics of Hono framework",
      "featured_image": "https://example.com/images/hono-cover.jpg",
      "view_count": 5420,
      "like_count": 234,
      "comment_count": 89,
      "created_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```
