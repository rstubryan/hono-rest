# RICH TEXT CONTENT FORMAT

## Overview

API supports multiple rich text formats for article content, with **Quill Delta** as the primary format for editing.

## Supported Formats

### 1. Quill Delta (Recommended)

**Content Type:** `quill_delta`

Best for: Rich text editing with Quill.js editor

**Request Example:**

```json
{
  "title": "My Article",
  "content": "{\"ops\":[{\"insert\":\"Hello World\\n\"}]}",
  "content_type": "quill_delta"
}
```

**Response Example:**

```json
{
  "content": "{\"ops\":[{\"insert\":\"Hello World\\n\"}]}",
  "content_type": "quill_delta",
  "content_html": "<p>Hello World</p>",
  "content_plain": "Hello World"
}
```

---

### 2. HTML

**Content Type:** `html`

Best for: Display purposes, SEO, RSS feeds

**Request Example:**

```json
{
  "content": "<h1>Hello World</h1>",
  "content_type": "html"
}
```

---

### 3. Markdown

**Content Type:** `markdown`

Best for: Developer-focused content, version control

**Request Example:**

```json
{
  "content": "# Hello World\\n\\nThis is **bold** text.",
  "content_type": "markdown"
}
```

---

## Field Descriptions

| Field           | Type          | Description                                     |
| --------------- | ------------- | ----------------------------------------------- |
| `content`       | string/object | Main content in specified format                |
| `content_type`  | string        | Format type: `quill_delta`, `html`, `markdown`  |
| `content_html`  | string        | Auto-generated HTML (output only)               |
| `content_plain` | string        | Auto-generated plain text (output only)         |
| `excerpt`       | string        | Short description for preview/SEO               |
| `word_count`    | integer       | Auto-calculated word count (output only)        |
| `reading_time`  | integer       | Estimated reading time in minutes (output only) |

---

## Quill Delta Format

### Basic Structure

Delta format is an array of operations describing document changes:

```json
{
  "ops": [
    { "insert": "Hello " },
    { "insert": "World", "attributes": { "bold": true } },
    { "insert": "\n" }
  ]
}
```

### Common Operations

| Operation  | Format                                                       | Description         |
| ---------- | ------------------------------------------------------------ | ------------------- |
| Plain text | `{ "insert": "text\n" }`                                     | Insert plain text   |
| Bold       | `{ "insert": "text", "attributes": { "bold": true } }`       | Bold text           |
| Italic     | `{ "insert": "text", "attributes": { "italic": true } }`     | Italic text         |
| Header     | `{ "insert": "Title", "attributes": { "header": 1 } }`       | H1-H6 headers       |
| List       | `{ "insert": "Item", "attributes": { "list": "bullet" } }`   | Bullet/ordered list |
| Code block | `{ "insert": "code", "attributes": { "code-block": true } }` | Code block          |
| Link       | `{ "insert": "text", "attributes": { "link": "url" } }`      | Hyperlink           |
| Image      | `{ "insert": { "image": "url" } }`                           | Embedded image      |

---

## Backend Processing

### Content Storage

1. **Store original format** in database (JSON/TEXT)
2. **Generate HTML** for display
3. **Generate plain text** for search/preview
4. **Calculate word count** and reading time
5. **Return all formats** in API response

### Response Fields

When creating/updating articles, API returns:

```json
{
  "content": "Original format (Quill Delta/HTML/Markdown)",
  "content_type": "Format type used",
  "content_html": "<p>Rendered HTML</p>",
  "content_plain": "Plain text without formatting",
  "excerpt": "First 200 chars of content_plain",
  "word_count": 156,
  "reading_time": 5
}
```

---

## Best Practices

### 1. Always Store Original Format

- Preserve full formatting capabilities
- Enable re-editing without quality loss

### 2. Auto-Generate Derivatives

- HTML for display
- Plain text for search
- Excerpt for preview

### 3. Use Quill Delta for Editing

- Preserves all formatting
- Enables rich text features
- Industry standard format

### 4. Sanitize HTML

- Prevent XSS attacks
- Clean user input
- Use whitelist approach

### 5. Validation

- Validate Delta JSON structure
- Check for malicious content
- Size limits (max 5MB)

---

## Error Handling

### Invalid Delta Format

```json
{
  "code": 422,
  "status": "VALIDATION_ERROR",
  "message": "Invalid Quill Delta format",
  "errors": [
    {
      "field": "content",
      "message": "Content must be valid Quill Delta JSON"
    }
  ]
}
```

### Unsupported Content Type

```json
{
  "code": 422,
  "status": "VALIDATION_ERROR",
  "message": "Content type not supported",
  "errors": [
    {
      "field": "content_type",
      "message": "Supported types: quill_delta, html, markdown"
    }
  ]
}
```

---

## Migration Strategy

### Existing Content

If migrating from existing system:

1. **HTML to Delta** - Use HTML-to-Delta converter
2. **Markdown to Delta** - Convert MD → HTML → Delta
3. **Plain Text to Delta** - Wrap in insert operations

### Conversion Tools

Recommended libraries:

- Quill Delta library for conversion
- HTML-to-Delta converters
- Markdown parsers (marked, remark)

---

## Summary

✅ **Primary Format:** Quill Delta (JSON)  
✅ **Alternative Formats:** HTML, Markdown  
✅ **Auto-Generated:** HTML, plain text, excerpt  
✅ **Output:** All formats returned in API response  
✅ **Storage:** Store original, generate derivatives  
✅ **Validation:** Sanitize and validate all input
