# DATABASE SCHEMA

Database schema untuk Blog API menggunakan PostgreSQL dan Prisma ORM.

## Tech Stack

- **ORM:** Prisma
- **Database:** PostgreSQL 14+
- **Type Safety:** Generated TypeScript types

---

## DESIGN PROCESS: STEP BY STEP

Berikut adalah alur desain database dari awal hingga final schema.

### Step 1: Identifikasi Core Entities

Pertama, kita identifikasi entitas utama yang diperlukan untuk blog system:

```
Blog System
├── Users (Pengguna)
├── Articles (Konten)
├── Categories (Kategorisasi)
├── Tags (Labeling)
└── Comments (Interaksi)
```

### Step 2: Start with Foundation - Users

Mulai dengan tabel paling dasar: **Users**

**Pertanyaan desain:**

- Apa yang dibutuhkan untuk user?
  - Email & password (auth)
  - Profil (name, bio, avatar)
  - Role (reader, author, admin)

**Hasil desain:**

```prisma
model User {
  id            String    @id @default(uuid())
  name          String?
  email         String    @unique
  password_hash String

  // Profil
  avatar        String?
  bio           String?   @db.Text
  website       String?

  // Timestamps
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  @@map("users")
}
```

### Step 3: Add Role-Based Access Control (RBAC)

Setelah user dasar, kita tambahkan system role & permission.

**Pertanyaan desain:**

- Apakah cukup dengan role sederhana di user table?
  - ❌ Tidak, karena butuh fleksibilitas untuk menambah permission baru
- Solusi: RBAC (Role-Based Access Control)

**Desain RBAC:**

```
Users →→ UserRoles →→ Roles →→ RolePermissions →→ Permissions
  ↑                                           ↑
  └───────────────────────────────────────────┘
        User memiliki Role yang punya Permission
```

**Implementasi:**

```prisma
// Roles (Reader, Author, Admin)
model Role {
  id     String @id @default(uuid())
  name   String @unique
  level  Int    @default(1)

  @@map("roles")
}

// Permissions (granular akses)
model Permission {
  id       String @id @default(uuid())
  name     String @unique  // ex: articles.create, articles.delete_own
  resource String          // ex: articles, users
  action   String          // ex: create, delete

  @@map("permissions")
}

// Many-to-Many: Roles ↔ Permissions
model RolePermission {
  role_id       String
  permission_id String

  role       Role       @relation(fields: [role_id], references: [id])
  permission Permission @relation(fields: [permission_id], references: [id])

  @id([role_id, permission_id])
  @@map("role_permissions")
}

// Many-to-Many: Users ↔ Roles
model UserRole {
  user_id String
  role_id String

  user User @relation(fields: [user_id], references: [id])
  role Role @relation(fields: [role_id], references: [id])

  @id([user_id, role_id])
  @@map("user_roles")
}
```

### Step 4: Design Articles - Core Content

Sekarang desain entitas utama: **Articles**

**Pertanyaan desain:**

- Article punya author? → Ya, relasi ke User
- Article butuh kategori? → Ya, satu category per article
- Article butuh tags? → Ya, multiple tags per article
- Content type? → Quill Delta, HTML, atau Markdown
- Status? → Draft atau Published

**Desain Articles:**

```prisma
model Article {
  id          String        @id @default(uuid())
  title       String
  slug        String        @unique
  content     String        @db.Text

  // Content metadata
  contentType ContentType  @default(QUILL_DELTA)
  excerpt     String?      @db.Text(500)

  // Status
  status      ArticleStatus @default(DRAFT)
  publishedAt DateTime?

  // Analytics
  viewCount   Int @default(0)

  // Relations
  authorId    String
  categoryId  String

  author      User     @relation(fields: [authorId], references: [id])
  category    Category @relation(fields: [categoryId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("articles")
}
```

### Step 5: Add Categories & Tags

**Pertanyaan desain:**

- Categories: Hierarchy atau flat? → Hierarchy (parent-child)
- Tags: Bisa banyak per article? → Ya, many-to-many

**Desain Categories:**

```prisma
model Category {
  id       String    @id @default(uuid())
  name     String
  slug     String    @unique

  parentId String?   // Untuk hierarchy
  parent   Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")

  articles Article[]

  @@map("categories")
}
```

**Desain Tags (many-to-many):**

```prisma
model Tag {
  id       String       @id @default(uuid())
  name     String
  slug     String       @unique
  color    String?      @db.VarChar(7)

  articles ArticleTag[] // Junction table

  @@map("tags")
}

// Junction table untuk many-to-many
model ArticleTag {
  articleId String
  tagId     String

  article Article @relation(fields: [articleId], references: [id])
  tag     Tag     @relation(fields: [tagId], references: [id])

  @id([articleId, tagId])
  @@map("article_tags")
}
```

### Step 6: Add Comments System

**Pertanyaan desain:**

- Comments punya replies? → Ya, self-reference (parent-child)
- Comments bisa dilike? → Ya, butuh CommentLikes table

**Desain Comments:**

```prisma
model Comment {
  id        String        @id @default(uuid())
  content   String        @db.Text

  articleId String
  userId    String
  parentId  String?       // Untuk replies

  status    CommentStatus @default(PENDING)

  article   Article   @relation(fields: [articleId], references: [id])
  user      User      @relation(fields: [userId], references: [id])
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")

  createdAt DateTime @default(now())

  @@map("comments")
}
```

### Step 7: Add User Interactions

**Pertanyaan desain:**

- User bisa like article? → Ya
- User bisa bookmark article? → Ya
- Perlu tracking views? → Ya, untuk analytics

**Desain Interactions:**

```prisma
// Like article
model ArticleLike {
  articleId String
  userId    String

  article Article @relation(fields: [articleId], references: [id])
  user    User    @relation(fields: [userId], references: [id])

  @id([articleId, userId]) // Composite key: cegah duplicate likes
  @@map("article_likes")
}

// Bookmark article
model ArticleBookmark {
  articleId String
  userId    String

  article Article @relation(fields: [articleId], references: [id])
  user    User    @relation(fields: [userId], references: [id])

  @id([articleId, userId]) // Composite key: cegah duplicate bookmarks
  @@map("article_bookmarks")
}

// Track views (including guest views)
model ArticleView {
  id        String   @id @default(uuid())
  articleId String
  userId    String?  // Optional, guest bisa view
  ipAddress String?  @db.VarChar(45)
  viewedAt  DateTime @default(now())

  article Article @relation(fields: [articleId], references: [id])

  @@map("article_views")
}

// Like comment
model CommentLike {
  commentId String
  userId    String

  comment Comment @relation(fields: [commentId], references: [id])
  user    User    @relation(fields: [userId], references: [id])

  @id([commentId, userId])
  @@map("comment_likes")
}
```

### Step 8: Add Authentication - Refresh Tokens

**Pertanyaan desain:**

- JWT access token short-lived
- Butuh refresh token untuk dapatkan access token baru

**Desain Refresh Tokens:**

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  revoked   Boolean  @default(false)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}
```

---

## COMPLETE SCHEMA

Berikut adalah **final Prisma schema** lengkap setelah melalui proses desain di atas.

### Complete Prisma Schema

---

## Prisma Schema

### Users & Authentication

```prisma
model User {
  id            String    @id @default(uuid())
  name          String?
  email         String    @unique
  password_hash String
  role          UserRole  @default(READER)

  avatar        String?
  bio           String?   @db.Text
  website       String?
  twitter       String?
  github        String?

  email_verified Boolean   @default(false)

  created_at     DateTime  @default(now())
  updated_at     DateTime  @updatedAt

  // Relations
  articles       Article[]
  comments       Comment[]
  articleLikes   ArticleLike[]
  articleBookmarks ArticleBookmark[]
  commentLikes   CommentLike[]
  userRoles      UserRole[]
  refreshTokens  RefreshToken[]
  articleViews   ArticleView[]

  @@map("users")
  @@index([email])
}

enum UserRole {
  READER
  AUTHOR
  ADMIN
}
```

### Roles & Permissions

```prisma
model Role {
  id          String   @id @default(uuid())
  name        String   @unique
  displayName  String
  description String?  @db.Text
  level       Int      @default(1)

  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt

  // Relations
  userRoles        UserRole[]
  rolePermissions  RolePermission[]
  permissions      Permission[]

  @@map("roles")
  @@index([name])
}

model Permission {
  id          String   @id @default(uuid())
  name        String   @unique
  displayName  String
  description String?  @db.Text
  resource    String
  action      String

  created_at   DateTime @default(now())

  // Relations
  rolePermissions RolePermission[]

  @@map("permissions")
  @@index([name])
}

model RolePermission {
  role_id       String
  permission_id String
  created_at    DateTime @default(now())

  @id([role_id, permission_id])

  role       Role       @relation(fields: [role_id], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permission_id], references: [id], onDelete: Cascade)

  @@map("role_permissions")
  @@index([role_id])
  @@index([permission_id])
}

model UserRole {
  user_id     String
  role_id     String
  assigned_by  String?
  reason      String?  @db.Text
  assigned_at  DateTime @default(now())

  @id([user_id, role_id])

  user User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  role Role @relation(fields: [role_id], references: [id], onDelete: Cascade)

  @@map("user_roles")
  @@index([user_id])
  @@index([role_id])
}
```

### Articles

```prisma
model Article {
  id             String        @id @default(uuid())
  title          String
  slug           String        @unique
  content        String        @db.Text
  contentType    ContentType  @default(QUILL_DELTA)

  contentHtml    String?      @db.Text
  contentPlain   String?      @db.Text
  excerpt        String?      @db.Text(500)

  featuredImage  String?

  status         ArticleStatus @default(DRAFT)
  publishedAt    DateTime?

  wordCount      Int           @default(0)
  readingTime    Int           @default(0)
  viewCount      Int           @default(0)

  categoryId     String
  authorId       String

  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  deletedAt      DateTime?

  // Relations
  author         User           @relation(fields: [authorId], references: [id])
  category       Category       @relation(fields: [categoryId], references: [id])
  tags           ArticleTag[]
  comments       Comment[]
  likes          ArticleLike[]
  bookmarks      ArticleBookmark[]
  views          ArticleView[]

  @@map("articles")
  @@index([slug])
  @@index([authorId])
  @@index([categoryId])
  @@index([status])
  @@index([publishedAt])
  @@index([createdAt])
}

enum ContentType {
  QUILL_DELTA
  HTML
  MARKDOWN
}

enum ArticleStatus {
  DRAFT
  PUBLISHED
}
```

### Categories

```prisma
model Category {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?  @db.Text

  parentId    String?

  metaTitle    String?  @db.VarChar(200)
  metaDescription String? @db.VarChar(500)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  articles    Article[]

  @@map("categories")
  @@index([slug])
  @@index([parentId])
}

model Tag {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?  @db.Text
  color       String?  @db.VarChar(7)

  metaTitle    String?  @db.VarChar(200)
  metaDescription String? @db.VarChar(500)

  articleCount Int     @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  articles    ArticleTag[]

  @@map("tags")
  @@index([slug])
}
```

### Article-Tag Relationship

```prisma
model ArticleTag {
  articleId String
  tagId     String
  createdAt DateTime @default(now())

  @id([articleId, tagId])

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  tag     Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@map("article_tags")
  @@index([articleId])
  @@index([tagId])
}
```

### Comments

```prisma
model Comment {
  id         String        @id @default(uuid())
  content    String        @db.Text

  articleId  String
  userId     String
  parentId   String?

  status     CommentStatus @default(PUBLISHED)

  likeCount  Int           @default(0)

  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
  deletedAt  DateTime?

  // Relations
  article    Article     @relation(fields: [articleId], references: [id])
  user       User        @relation(fields: [userId], references: [id])
  parent     Comment?    @relation("CommentReplies", fields: [parentId], references: [id])
  replies    Comment[]   @relation("CommentReplies")
  likes      CommentLike[]

  @@map("comments")
  @@index([articleId])
  @@index([userId])
  @@index([parentId])
  @@index([status])
}

enum CommentStatus {
  PENDING
  PUBLISHED
  SPAM
}
```

### Interactions

```prisma
model ArticleLike {
  articleId String
  userId    String
  createdAt DateTime @default(now())

  @id([articleId, userId])

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("article_likes")
  @@index([articleId])
  @@index([userId])
}

model ArticleBookmark {
  articleId String
  userId    String
  createdAt DateTime @default(now())

  @id([articleId, userId])

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("article_bookmarks")
  @@index([articleId])
  @@index([userId])
}

model ArticleView {
  id          String   @id @default(uuid())
  articleId   String
  userId      String?
  ipAddress   String?  @db.VarChar(45)
  userAgent   String?  @db.Text
  viewedAt    DateTime @default(now())

  article     Article @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@map("article_views")
  @@index([articleId])
  @@index([userId])
  @@index([viewedAt])
}

model CommentLike {
  commentId String
  userId    String
  createdAt DateTime @default(now())

  @id([commentId, userId])

  comment Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("comment_likes")
  @@index([commentId])
  @@index([userId])
}
```

### Refresh Tokens

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  revoked   Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
  @@index([userId])
  @@index([token])
}
```

---

## ER Diagram

```
Users (1) ----< (N) Articles
  |                    |
  |                    +----< (N) ArticleViews
  |
  +----< (N) Comments
  |                    |
  |                    +----< (N) CommentLikes
  |
  +----< (N) ArticleLikes
  +----< (N) ArticleBookmarks

Articles (N) ---- (1) Categories
Articles (N) ----< (N) Tags
Articles (N) ----< (N) Comments

Roles (N) ----< (N) Permissions
  |
  +----< (N) UserRoles
        |
        +----> (1) Users
```

---

## Database Migrations

### Migration Files

```bash
prisma/
├── schema.prisma           # Main schema file
├── migrations/
│   ├── 20240120000000_init/
│   │   └── migration.sql
│   ├── 20240120000001_add_rbac/
│   │   └── migration.sql
│   ├── 20240120000002_add_articles/
│   │   └── migration.sql
│   └── ...
└── seed.prisma              # Seed data
```

### Creating Migration

```bash
# Create migration
npx prisma migrate dev --name add_articles

# Run migration
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

---

## Seed Data

### Default Roles

```sql
INSERT INTO "Role" (name, "displayName", "description", "level") VALUES
  ('reader', 'Reader', 'Can read and interact with content', 1),
  ('author', 'Author', 'Can create and manage own content', 2),
  ('admin', 'Administrator', 'Full system access', 3);
```

### Default Permissions

```sql
INSERT INTO "Permission" (name, "displayName", "description", "resource", "action") VALUES
  -- Articles
  ('articles.view', 'View Articles', 'View published articles', 'articles', 'view'),
  ('articles.create', 'Create Articles', 'Create new articles', 'articles', 'create'),
  ('articles.update_own', 'Update Own Articles', 'Update own articles', 'articles', 'update_own'),
  ('articles.update_any', 'Update Any Articles', 'Update any articles', 'articles', 'update_any'),
  ('articles.delete_own_draft', 'Delete Own Draft Articles', 'Delete own draft articles', 'articles', 'delete_own_draft'),
  ('articles.delete_any', 'Delete Any Articles', 'Delete any articles', "articles', 'delete_any'),
  ('articles.publish', 'Publish Articles', 'Publish or unpublish articles', 'articles', 'publish'),
  ('articles.like', 'Like Articles', 'Like articles', 'articles', 'like'),
  ('articles.bookmark', 'Bookmark Articles', 'Bookmark articles', 'articles', 'bookmark'),

  -- Categories
  ('categories.view', 'View Categories', 'View categories', 'categories', 'view'),
  ('categories.manage', 'Manage Categories', 'Create, edit, delete categories', 'categories', 'manage'),

  -- Tags
  ('tags.view', 'View Tags', 'View tags', 'tags', 'view'),
  ('tags.manage', 'Manage Tags', 'Create, edit, delete tags', 'tags', 'manage'),

  -- Comments
  ('comments.create', 'Create Comments', 'Create new comments', 'comments', 'create'),
  ('comments.edit_own', 'Edit Own Comments', 'Edit own comments', 'comments', 'edit_own'),
  ('comments.edit_any', 'Edit Any Comments', 'Edit any comments', 'comments', 'edit_any'),
  ('comments.delete_own', 'Delete Own Comments', 'Delete own comments', "comments', 'delete_own'),
  ('comments.delete_any', 'Delete Any Comments', 'Delete any comments', 'comments', 'delete_any'),
  ('comments.moderate_own', 'Moderate Own Article Comments', 'Moderate comments on own articles', 'comments', 'moderate_own'),
  ('comments.moderate', 'Moderate Any Comments', 'Moderate any comments', 'comments', 'moderate'),

  -- Users
  ('users.manage', 'Manage Users', 'Manage all users', 'users', 'manage'),
  ('users.change_role', 'Change User Roles', 'Assign or remove user roles', 'users', 'change_role'),

  -- Analytics
  ('analytics.view_own', 'View Own Analytics', 'View own article analytics', 'analytics', 'view_own'),
  ('analytics.view_all', 'View All Analytics', 'View all analytics', 'analytics', 'view_all'),

  -- System
  ('admin.access', 'Access Admin Panel', 'Access admin panel', 'admin', 'access');
```

### Role-Permission Assignments

```sql
-- Reader permissions
INSERT INTO "RolePermission" (role_id, permission_id)
SELECT r.id, p.id FROM "Role" r, "Permission" p
WHERE r.name = 'reader' AND p.name IN (
  'articles.view', 'articles.like', 'articles.bookmark',
  'comments.create', 'comments.edit_own', 'comments.delete_own'
);

-- Author permissions
INSERT INTO "RolePermission" (role_id, permission_id)
SELECT r.id, p.id FROM "Role" r, "Permission" p
WHERE r.name = 'author' AND p.name IN (
  'articles.view', 'articles.create', 'articles.update_own', 'articles.delete_own_draft',
  'articles.like', 'articles.bookmark',
  'comments.create', 'comments.edit_own', 'comments.delete_own', 'comments.moderate_own',
  'analytics.view_own'
);

-- Admin permissions (all)
INSERT INTO "RolePermission" (role_id, permission_id)
SELECT r.id, p.id FROM "Role" r, "Permission" p
WHERE r.name = 'admin';
```

---

## Database Constraints

### Unique Constraints

- `User.email` - Email must be unique
- `Article.slug` - Slug must be unique
- `Tag.slug` - Tag slug must be unique
- `Category.slug` - Category slug must be unique
- `RefreshToken.token` - Token must be unique

### Indexes

**Performance Indexes:**

- `User.email` - Login queries
- `Article.slug` - Article lookup by slug
- `Article.authorId` - User's articles
- `Article.categoryId` - Category articles
- `Article.status` - Filter by status
- `Article.publishedAt` - Chronological queries
- `Comment.articleId` - Article comments
- `Comment.userId` - User comments
- `ArticleView.viewedAt` - Analytics queries

**Composite Indexes:**

- `ArticleLike(articleId, userId)` - Prevent duplicate likes
- `ArticleBookmark(articleId, userId)` - Prevent duplicate bookmarks
- `CommentLike(commentId, userId)` - Prevent duplicate comment likes
- `UserRole(userId, roleId)` - One role per user per assignment

---

## Data Types

### PostgreSQL Types

| Prisma Type             | PostgreSQL Type | Description             |
| ----------------------- | --------------- | ----------------------- |
| `String`                | `VARCHAR(255)`  | Variable-length string  |
| `String @db.Text`       | `TEXT`          | Unlimited text          |
| `String @db.VarChar(n)` | `VARCHAR(n)`    | Fixed max length        |
| `Int`                   | `INTEGER`       | 32-bit integer          |
| `Boolean`               | `BOOLEAN`       | True/false              |
| `DateTime`              | `TIMESTAMPTZ`   | Timestamp with timezone |
| `Uuid`                  | `UUID`          | UUID v4                 |

### Example Usage

```prisma
model Article {
  title      String   @db.VarChar(200)  -- VARCHAR(200)
  content    String   @db.Text           -- TEXT
  viewCount  Int      @default(0)         -- INTEGER
  createdAt  DateTime @default(now())    -- TIMESTAMPTZ
}
```

---

## Connection String

### Environment Variables

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/blog_db?schema=public"
```

### Prisma Client Generation

```bash
# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (DB GUI)
npx prisma studio

# Push schema changes (dev only)
npx prisma db push

# Create migration
npx prisma migrate dev --name migration_name

# Run migrations (production)
npx prisma migrate deploy
```

---

## Schema Relationships

### One-to-Many

```prisma
model User {
  articles Article[]  // One user has many articles
}

model Article {
  authorId String
  author   User    @relation(fields: [authorId], references: [id])
}
```

### Many-to-Many

```prisma
model Article {
  tags ArticleTag[]  // Junction table
}

model Tag {
  articles ArticleTag[]
}

model ArticleTag {
  articleId String
  tagId     String

  article Article @relation(fields: [articleId], references: [id])
  tag     Tag     @relation(fields: [tagId], references: [id])
}
```

### Self-Reference

```prisma
model Comment {
  parentId  String?
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
}
```

---

## Database Backup & Restore

### Backup

```bash
# Dump database schema and data
pg_dump -U postgres blog_db > backup.sql

# Dump schema only
pg_dump -U postgres --schema-only blog_db > schema.sql

# Dump data only
pg_dump -U postgres --data-only blog_db > data.sql
```

### Restore

```bash
# Restore from backup
psql -U postgres blog_db < backup.sql
```

---

## Performance Optimization

### Query Optimization

1. **Use indexes** - Add indexes on frequently queried fields
2. **Select specific fields** - Avoid `SELECT *`
3. **Use pagination** - Limit result sets
4. **Connection pooling** - Reuse database connections
5. **Preload relations** - Use `include` in Prisma

### Example Query Optimization

```typescript
// Instead of multiple queries
const articles = await prisma.article.findMany({
  where: { status: 'PUBLISHED' },
  include: {
    author: { select: { id: true, name: true, avatar: true } },
    category: { select: { id: true, name: true, slug: true } },
    tags: { select: { id: true, name: true, slug: true } },
  },
  take: 10,
  orderBy: { createdAt: 'desc' },
})
```

---

## Summary

✅ **ORM:** Prisma  
✅ **Database:** PostgreSQL 14+  
✅ **Tables:** 15 tables  
✅ **Relations:** One-to-many, Many-to-many, Self-reference  
✅ **Indexes:** Performance optimized  
✅ **Migrations:** Version-controlled schema changes  
✅ **Type Safety:** Auto-generated TypeScript types  
✅ **Seed Data:** Default roles & permissions

Ready for implementation! 🚀
