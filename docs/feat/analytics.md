# ANALYTICS API

## Article Analytics

GET /api/v1/analytics/articles/:articleId

Authorization: Bearer ${token} (Author/Admin only)

**URL Parameters:**

- `articleId` (string): Article ID or slug

**Query Parameters:**

| Parameter | Type   | Default | Description                        |
| --------- | ------ | ------- | ---------------------------------- |
| period    | string | 30d     | Time period: 1d, 7d, 30d, 90d, all |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Article analytics retrieved successfully",
  "data": {
    "article": {
      "id": "uuid-article-id",
      "title": "Getting Started with Hono",
      "slug": "getting-started-with-hono"
    },
    "period": "30d",
    "metrics": {
      "views": {
        "total": 5420,
        "unique": 4125,
        "trend": "+15.5%"
      },
      "engagement": {
        "likes": 234,
        "comments": 89,
        "shares": 45,
        "bookmarks": 123,
        "avg_read_time": "4m 32s"
      },
      "demographics": {
        "countries": {
          "US": 1245,
          "ID": 892,
          "IN": 654
        },
        "devices": {
          "desktop": 3245,
          "mobile": 1890,
          "tablet": 285
        },
        "sources": {
          "google": 2340,
          "direct": 1560,
          "twitter": 890,
          "linkedin": 630
        }
      },
      "daily_views": [
        {
          "date": "2024-01-01",
          "views": 145,
          "unique_views": 128
        },
        {
          "date": "2024-01-02",
          "views": 189,
          "unique_views": 167
        }
      ]
    }
  }
}
```

---

## Dashboard Analytics (Admin)

GET /api/v1/analytics/dashboard?period=7d

Authorization: Bearer ${token} (Admin only)

**Query Parameters:**

| Parameter | Type   | Default | Description                   |
| --------- | ------ | ------- | ----------------------------- |
| period    | string | 7d      | Time period: 1d, 7d, 30d, 90d |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Dashboard analytics retrieved successfully",
  "data": {
    "period": "7d",
    "overview": {
      "total_views": 45230,
      "unique_visitors": 32150,
      "total_articles": 125,
      "total_users": 4520,
      "total_comments": 890,
      "total_likes": 2340
    },
    "content": {
      "top_articles": [
        {
          "id": "uuid-article-id",
          "title": "Getting Started with Hono",
          "slug": "getting-started-with-hono",
          "views": 5420,
          "likes": 234,
          "comments": 89,
          "avg_read_time": "4m 32s"
        }
      ],
      "top_categories": [
        {
          "id": "uuid-category-id",
          "name": "Programming",
          "slug": "programming",
          "views": 15230,
          "articles": 45
        }
      ],
      "top_authors": [
        {
          "id": "uuid-author-id",
          "name": "John Doe",
          "avatar": "https://example.com/avatars/john.jpg",
          "total_views": 12450,
          "total_articles": 12,
          "total_likes": 567
        }
      ]
    },
    "traffic": {
      "daily_views": [
        {
          "date": "2024-01-14",
          "views": 6234,
          "unique_visitors": 4521
        },
        {
          "date": "2024-01-15",
          "views": 6890,
          "unique_visitors": 5123
        }
      ],
      "sources": {
        "google": 18234,
        "direct": 12345,
        "twitter": 6789,
        "linkedin": 4567,
        "facebook": 3295
      },
      "devices": {
        "desktop": 28456,
        "mobile": 14567,
        "tablet": 2207
      },
      "countries": {
        "US": 12456,
        "ID": 8934,
        "IN": 6789,
        "GB": 4567,
        "PH": 3456
      }
    },
    "engagement": {
      "total_likes": 2340,
      "total_comments": 890,
      "total_shares": 456,
      "total_bookmarks": 1234,
      "avg_engagement_rate": "8.5%"
    },
    "growth": {
      "views_growth": "+15.5%",
      "users_growth": "+12.3%",
      "engagement_growth": "+8.7%"
    }
  }
}
```

---

## Real-time Stats

GET /api/v1/analytics/realtime

Authorization: Bearer ${token} (Admin only)

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Real-time stats retrieved successfully",
  "data": {
    "timestamp": "2024-01-21T10:00:00Z",
    "current": {
      "online_users": 234,
      "page_views_last_30min": 567,
      "page_views_last_hour": 1234
    },
    "active_articles": [
      {
        "id": "uuid-article-id",
        "title": "Getting Started with Hono",
        "slug": "getting-started-with-hono",
        "current_readers": 45
      }
    ]
  }
}
```

---

## Export Analytics

GET /api/v1/analytics/export?type=article&period=30d&format=csv

Authorization: Bearer ${token} (Admin only)

**Query Parameters:**

| Parameter | Type   | Default  | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| type      | string | required | Type: article, user, overall |
| period    | string | 30d      | Time period: 7d, 30d, 90d    |
| format    | string | csv      | Format: csv, json, xlsx      |

**Response Success (200):**

Returns file download with appropriate headers:

```
Content-Type: text/csv
Content-Disposition: attachment; filename="analytics-article-30d-20240121.csv"
```

**CSV Format:**

```csv
Article ID,Title,Slug,Views,Unique Views,Likes,Comments,Shares,Avg Read Time
uuid-1,Getting Started with Hono,getting-started-with-hono,5420,4125,234,89,45,4m 32s
uuid-2,Advanced Hono Patterns,advanced-hono-patterns,3890,3120,189,67,34,6m 15s
```

---

## Search Analytics

GET /api/v1/analytics/search?period=30d&page=1&limit=20

Authorization: Bearer ${token} (Admin only)

**Query Parameters:**

| Parameter | Type    | Default | Description               |
| --------- | ------- | ------- | ------------------------- |
| period    | string  | 30d     | Time period: 7d, 30d, 90d |
| page      | integer | 1       | Page number               |
| limit     | integer | 20      | Items per page            |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Search analytics retrieved successfully",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total_pages": 5,
      "total_results": 100
    },
    "period": "30d"
  },
  "data": [
    {
      "query": "hono framework",
      "search_count": 456,
      "avg_results": 12,
      "click_through_rate": "35.5%",
      "top_result": {
        "id": "uuid-article-id",
        "title": "Getting Started with Hono"
      }
    },
    {
      "query": "typescript tutorial",
      "search_count": 389,
      "avg_results": 23,
      "click_through_rate": "28.3%",
      "top_result": {
        "id": "uuid-article-id",
        "title": "TypeScript Basics"
      }
    }
  ]
}
```

---

## Author Stats

GET /api/v1/analytics/my-stats?period=30d

Authorization: Bearer ${token} (Author only)

**Query Parameters:**

| Parameter | Type   | Default | Description                    |
| --------- | ------ | ------- | ------------------------------ |
| period    | string | 30d     | Time period: 7d, 30d, 90d, all |

**Response Success (200):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Author stats retrieved successfully",
  "data": {
    "author": {
      "id": "uuid-author-id",
      "name": "John Doe"
    },
    "period": "30d",
    "overview": {
      "total_views": 45230,
      "total_articles": 12,
      "total_likes": 567,
      "total_comments": 234,
      "total_followers": 89
    },
    "top_articles": [
      {
        "id": "uuid-article-id",
        "title": "Getting Started with Hono",
        "slug": "getting-started-with-hono",
        "views": 5420,
        "likes": 234,
        "comments": 89
      }
    ],
    "recent_articles": [
      {
        "id": "uuid-article-id",
        "title": "Getting Started with Hono",
        "slug": "getting-started-with-hono",
        "published_at": "2024-01-20T10:00:00Z",
        "views": 5420,
        "likes": 234
      }
    ],
    "engagement": {
      "avg_views_per_article": 3769,
      "avg_likes_per_article": 47,
      "avg_comments_per_article": 19,
      "total_shares": 123
    }
  }
}
```
