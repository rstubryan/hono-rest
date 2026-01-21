# CATEGORIES API

## Create Category

POST /api/v1/categories

Authorization: Bearer ${token} (Admin only)

**Request Body:**

```json
{
  "name": "Programming",
  "description": "Programming tutorials and articles",
  "slug": "programming",
  "parent_id": null,
  "meta_title": "Programming Articles - Best Tutorials",
  "meta_description": "Discover the best programming tutorials and articles"
}
```

**Response Success (201):**

```json
{
  "code": 201,
  "status": "success",
  "message": "Category created successfully",
  "data": {
    "id": "uuid-category-id",
    "name": "Programming",
    "description": "Programming tutorials and articles",
    "slug": "programming",
    "parent_id": null,
    "meta_title": "Programming Articles - Best Tutorials",
    "meta_description": "Discover the best programming tutorials and articles",
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
  "status": "validation_error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required and must be between 3 and 100 characters"
    },
    {
      "field": "slug",
      "message": "Slug must be unique"
    }
  ]
}
```

---

## List Categories

GET /api/v1/categories?page=1&limit=10&parent=null

**Query Parameters:**

| Parameter | Type    | Default | Description                                             |
| --------- | ------- | ------- | ------------------------------------------------------- |
| page      | integer | 1       | Page number                                             |
| limit     | integer | 10      | Items per page (max: 100)                               |
| parent    | string  | null    | Filter by parent category ID (null for root categories) |
| search    | string  | null    | Search in name and description                          |
| sort      | string  | name    | Sort by: name, article_count, latest                    |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Categories retrieved successfully",
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
      "id": "uuid-category-id",
      "name": "Programming",
      "description": "Programming tutorials and articles",
      "slug": "programming",
      "parent_id": null,
      "article_count": 45,
      "created_at": "2024-01-20T10:00:00Z",
      "children": [
        {
          "id": "uuid-child-category-id",
          "name": "Web Development",
          "slug": "web-development",
          "article_count": 23
        },
        {
          "id": "uuid-child-category-id",
          "name": "Mobile Development",
          "slug": "mobile-development",
          "article_count": 12
        }
      ]
    }
  ]
}
```

---

## Get Category Detail

GET /api/v1/categories/:idOrSlug

**URL Parameters:**

- `idOrSlug` (string): Category ID or slug

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Category retrieved successfully",
  "data": {
    "id": "uuid-category-id",
    "name": "Programming",
    "description": "Programming tutorials and articles",
    "slug": "programming",
    "parent_id": null,
    "parent": null,
    "meta_title": "Programming Articles - Best Tutorials",
    "meta_description": "Discover the best programming tutorials and articles",
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
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z",
    "children": [
      {
        "id": "uuid-child-category-id",
        "name": "Web Development",
        "slug": "web-development",
        "description": "Web development articles",
        "article_count": 23
      }
    ]
  }
}
```

**Response Error (404):**

```json
{
  "code": 404,
  "status": "not_found",
  "message": "Category not found",
  "errors": []
}
```

---

## Update Category

PATCH /api/v1/categories/:id

Authorization: Bearer ${token} (Admin only)

**Request Body:**

```json
{
  "name": "Programming & Development",
  "description": "Updated description",
  "slug": "programming-development",
  "parent_id": null,
  "meta_title": "Updated meta title",
  "meta_description": "Updated meta description"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Category updated successfully",
  "data": {
    "id": "uuid-category-id",
    "name": "Programming & Development",
    "description": "Updated description",
    "slug": "programming-development",
    "parent_id": null,
    "article_count": 45,
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-21T10:00:00Z"
  }
}
```

---

## Delete Category

DELETE /api/v1/categories/:id

Authorization: Bearer ${token} (Admin only)

**Query Parameters:**

| Parameter | Type    | Default | Description                       |
| --------- | ------- | ------- | --------------------------------- |
| force     | boolean | false   | Force delete even if has articles |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Category deleted successfully",
  "data": {
    "id": "uuid-category-id",
    "deleted_at": "2024-01-21T10:00:00Z",
    "articles_moved": null
  }
}
```

**Response Error (400):**

```json
{
  "code": 400,
  "status": "bad_request",
  "message": "Cannot delete category with existing articles",
  "errors": [
    {
      "field": "category",
      "message": "This category contains 45 articles. Use ?force=true to delete and move articles to parent category, or specify ?move_to=category-id"
    }
  ]
}
```

---

## Category Tree

GET /api/v1/categories/tree

**Query Parameters:**

| Parameter     | Type    | Default | Description                         |
| ------------- | ------- | ------- | ----------------------------------- |
| max_depth     | integer | 3       | Maximum depth of tree               |
| include_empty | boolean | false   | Include categories with no articles |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Category tree retrieved successfully",
  "data": [
    {
      "id": "uuid-category-id",
      "name": "Programming",
      "slug": "programming",
      "article_count": 45,
      "depth": 0,
      "children": [
        {
          "id": "uuid-child-category-id",
          "name": "Web Development",
          "slug": "web-development",
          "article_count": 23,
          "depth": 1,
          "children": [
            {
              "id": "uuid-grandchild-category-id",
              "name": "Frontend",
              "slug": "frontend",
              "article_count": 15,
              "depth": 2,
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": "uuid-category-id",
      "name": "Design",
      "slug": "design",
      "article_count": 28,
      "depth": 0,
      "children": []
    }
  ]
}
```
