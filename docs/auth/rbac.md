# ROLE-BASED ACCESS CONTROL (RBAC)

## Overview

RBAC system untuk mengatur akses user berdasarkan role dan permission.

## Roles

### **1. Reader**

Default role untuk user baru.

**Permissions:**

- View published articles
- Like articles
- Bookmark articles
- Comment on articles
- Manage own profile
- View own interactions

**Can NOT:**

- Create articles
- Edit/delete any article
- Manage categories/tags
- Moderate comments
- Access admin panel

---

### **2. Author**

User yang bisa create dan manage content sendiri.

**Permissions:**

- All Reader permissions
- Create articles
- Edit own articles (draft & published)
- Delete own articles (draft only)
- View own article analytics
- Moderate comments on own articles

**Can NOT:**

- Edit/delete other users' articles
- Publish articles (requires admin approval)
- Manage categories/tags (create/edit/delete)
- Create or edit tags
- Moderate all comments
- Access admin panel

---

### **3. Admin**

Full access ke seluruh system.

**Permissions:**

- All Author permissions
- Create/edit/delete any article
- Publish/unpublish any article
- Create/edit/delete categories
- Create/edit/delete tags
- Moderate all comments
- Manage all users
- Access dashboard analytics
- Export data
- System settings

---

## Permission Matrix

| Resource/Action    | Reader | Author           | Admin |
| ------------------ | ------ | ---------------- | ----- |
| **Articles**       |
| View published     | ✅     | ✅               | ✅    |
| View draft         | ❌     | ✅ (own)         | ✅    |
| Create             | ❌     | ✅               | ✅    |
| Edit own           | ❌     | ✅               | ✅    |
| Edit others        | ❌     | ❌               | ✅    |
| Delete own (draft) | ❌     | ✅               | ✅    |
| Delete others      | ❌     | ❌               | ✅    |
| Delete published   | ❌     | ❌               | ✅    |
| Publish            | ❌     | ❌               | ✅    |
| **Categories**     |
| View               | ✅     | ✅               | ✅    |
| Create             | ❌     | ❌               | ✅    |
| Edit               | ❌     | ❌               | ✅    |
| Delete             | ❌     | ❌               | ✅    |
| **Tags**           |
| View               | ✅     | ✅               | ✅    |
| Create             | ❌     | ❌               | ✅    |
| Edit               | ❌     | ❌               | ✅    |
| Delete             | ❌     | ❌               | ✅    |
| **Comments**       |
| View               | ✅     | ✅               | ✅    |
| Create             | ✅     | ✅               | ✅    |
| Edit own           | ✅     | ✅               | ✅    |
| Edit others        | ❌     | ❌               | ✅    |
| Delete own         | ✅     | ✅               | ✅    |
| Delete others      | ❌     | ❌               | ✅    |
| Moderate           | ❌     | ✅ (own article) | ✅    |
| **Users**          |
| View profile       | ✅     | ✅               | ✅    |
| Edit own profile   | ✅     | ✅               | ✅    |
| Edit others        | ❌     | ❌               | ✅    |
| Delete user        | ❌     | ❌               | ✅    |
| Change role        | ❌     | ❌               | ✅    |
| **Analytics**      |
| View article stats | ❌     | ✅ (own)         | ✅    |
| View dashboard     | ❌     | ❌               | ✅    |
| Export data        | ❌     | ❌               | ✅    |

---

## Role Management API

### Get All Roles

GET /api/v1/roles

Authorization: Bearer ${token} (Admin only)

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Roles retrieved successfully",
  "data": [
    {
      "id": "uuid-role-id",
      "name": "reader",
      "display_name": "Reader",
      "description": "Can read and interact with content",
      "level": 1,
      "permissions": [
        "articles.view",
        "articles.like",
        "articles.bookmark",
        "comments.create",
        "comments.edit_own",
        "comments.delete_own",
        "profile.update"
      ],
      "user_count": 1520,
      "created_at": "2024-01-20T10:00:00Z"
    },
    {
      "id": "uuid-role-id",
      "name": "author",
      "display_name": "Author",
      "description": "Can create and manage own content",
      "level": 2,
      "permissions": [
        "articles.view",
        "articles.create",
        "articles.update_own",
        "articles.delete_own_draft",
        "articles.like",
        "articles.bookmark",
        "comments.create",
        "comments.edit_own",
        "comments.delete_own",
        "comments.moderate_own",
        "analytics.view_own",
        "profile.update"
      ],
      "user_count": 45,
      "created_at": "2024-01-20T10:00:00Z"
    },
    {
      "id": "uuid-role-id",
      "name": "admin",
      "display_name": "Administrator",
      "description": "Full system access",
      "level": 3,
      "permissions": ["*"],
      "user_count": 5,
      "created_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

### Get Role Detail

GET /api/v1/roles/:idOrName

Authorization: Bearer ${token} (Admin only)

**URL Parameters:**

- `idOrName` (string): Role ID or name (reader, author, admin)

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Role retrieved successfully",
  "data": {
    "id": "uuid-role-id",
    "name": "author",
    "display_name": "Author",
    "description": "Can create and manage own content",
    "level": 2,
    "permissions": [
      {
        "id": "uuid-permission-id",
        "name": "articles.create",
        "description": "Create new articles",
        "resource": "articles",
        "action": "create"
      },
      {
        "id": "uuid-permission-id",
        "name": "articles.update_own",
        "description": "Update own articles",
        "resource": "articles",
        "action": "update_own"
      }
    ],
    "user_count": 45,
    "created_at": "2024-01-20T10:00:00Z"
  }
}
```

---

## User Role Management

### Assign Role to User

POST /api/v1/users/:userId/role

Authorization: Bearer ${token} (Admin only)

**Request Body:**

```json
{
  "role_id": "uuid-role-id",
  "reason": "Promoted to Author for good content contributions"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Role assigned successfully",
  "data": {
    "user_id": "uuid-user-id",
    "role": {
      "id": "uuid-role-id",
      "name": "author",
      "display_name": "Author"
    },
    "previous_role": {
      "id": "uuid-role-id",
      "name": "reader"
    },
    "assigned_at": "2024-01-21T10:00:00Z",
    "assigned_by": {
      "id": "uuid-admin-id",
      "name": "Admin User"
    }
  }
}
```

**Response Error (403):**

```json
{
  "code": 403,
  "status": "FORBIDDEN",
  "message": "Cannot assign role higher than your own",
  "errors": []
}
```

---

### Remove User Role

DELETE /api/v1/users/:userId/role

Authorization: Bearer ${token} (Admin only)

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Role removed successfully",
  "data": {
    "user_id": "uuid-user-id",
    "previous_role": {
      "id": "uuid-role-id",
      "name": "author"
    },
    "new_role": {
      "id": "uuid-role-id",
      "name": "reader"
    },
    "removed_at": "2024-01-21T10:00:00Z",
    "removed_by": {
      "id": "uuid-admin-id",
      "name": "Admin User"
    }
  }
}
```

---

## Permission Check API

### Check User Permissions

GET /api/v1/auth/me/permissions

Authorization: Bearer ${token}

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Permissions retrieved successfully",
  "data": {
    "user_id": "uuid-user-id",
    "role": {
      "id": "uuid-role-id",
      "name": "author",
      "display_name": "Author"
    },
    "permissions": [
      "articles.view",
      "articles.create",
      "articles.update_own",
      "articles.delete_own_draft",
      "categories.view",
      "tags.view",
      "comments.create",
      "comments.edit_own",
      "comments.delete_own",
      "comments.moderate_own",
      "profile.update",
      "analytics.view_own"
    ],
    "can": {
      "create_article": true,
      "delete_article": false,
      "moderate_comments": true,
      "access_admin_panel": false
    }
  }
}
```

---

### Check Specific Permission

POST /api/v1/auth/me/check-permission

Authorization: Bearer ${token}

**Request Body:**

```json
{
  "permission": "articles.create"
}
```

**Response Success (200):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Permission checked successfully",
  "data": {
    "permission": "articles.create",
    "allowed": true,
    "reason": "User has role 'author' with permission 'articles.create'"
  }
}
```

**Response Success (200 - Not Allowed):**

```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Permission checked successfully",
  "data": {
    "permission": "articles.delete_any",
    "allowed": false,
    "reason": "User role 'author' does not have permission 'articles.delete_any'"
  }
}
```

---

## Complete Permissions List

### Articles Permissions

| Permission Name             | Display Name              | Description                   |
| --------------------------- | ------------------------- | ----------------------------- |
| `articles.view`             | View Articles             | View published articles       |
| `articles.create`           | Create Articles           | Create new articles           |
| `articles.update_own`       | Update Own Articles       | Update own articles           |
| `articles.update_any`       | Update Any Articles       | Update any articles           |
| `articles.delete_own_draft` | Delete Own Draft Articles | Delete own draft articles     |
| `articles.delete_any`       | Delete Any Articles       | Delete any articles           |
| `articles.publish`          | Publish Articles          | Publish or unpublish articles |
| `articles.like`             | Like Articles             | Like articles                 |
| `articles.bookmark`         | Bookmark Articles         | Bookmark articles             |

### Categories Permissions

| Permission Name     | Display Name      | Description                     |
| ------------------- | ----------------- | ------------------------------- |
| `categories.view`   | View Categories   | View categories                 |
| `categories.manage` | Manage Categories | Create, edit, delete categories |

### Tags Permissions

| Permission Name | Display Name | Description               |
| --------------- | ------------ | ------------------------- |
| `tags.view`     | View Tags    | View tags                 |
| `tags.manage`   | Manage Tags  | Create, edit, delete tags |

### Comments Permissions

| Permission Name         | Display Name                  | Description                       |
| ----------------------- | ----------------------------- | --------------------------------- |
| `comments.create`       | Create Comments               | Create new comments               |
| `comments.edit_own`     | Edit Own Comments             | Edit own comments                 |
| `comments.edit_any`     | Edit Any Comments             | Edit any comments                 |
| `comments.delete_own`   | Delete Own Comments           | Delete own comments               |
| `comments.delete_any`   | Delete Any Comments           | Delete any comments               |
| `comments.moderate_own` | Moderate Own Article Comments | Moderate comments on own articles |
| `comments.moderate`     | Moderate Any Comments         | Moderate any comments             |

### Users Permissions

| Permission Name     | Display Name      | Description                 |
| ------------------- | ----------------- | --------------------------- |
| `users.manage`      | Manage Users      | Manage all users            |
| `users.change_role` | Change User Roles | Assign or remove user roles |

### Analytics Permissions

| Permission Name      | Display Name       | Description                |
| -------------------- | ------------------ | -------------------------- |
| `analytics.view_own` | View Own Analytics | View own article analytics |
| `analytics.view_all` | View All Analytics | View all analytics         |

### System Permissions

| Permission Name | Display Name       | Description        |
| --------------- | ------------------ | ------------------ |
| `admin.access`  | Access Admin Panel | Access admin panel |

---

### Role-Permission Mapping

#### Reader Role (Level 1)

```
articles.view
articles.like
articles.bookmark
comments.create
comments.edit_own
comments.delete_own
profile.update
```

#### Author Role (Level 2)

```
articles.view
articles.create
articles.update_own
articles.delete_own_draft
articles.like
articles.bookmark
comments.create
comments.edit_own
comments.delete_own
comments.moderate_own
analytics.view_own
profile.update
```

#### Admin Role (Level 3)

```
* (All permissions)
```

---

### Permission Summary

**Total Permissions: 20**

**Breakdown by Resource:**

- Articles: 9 permissions
- Categories: 2 permissions
- Tags: 2 permissions
- Comments: 7 permissions
- Users: 2 permissions
- Analytics: 2 permissions
- System: 1 permission
