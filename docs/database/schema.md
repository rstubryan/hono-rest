# DATABASE SCHEMA

Database schema untuk Blog API menggunakan PostgreSQL dan Prisma ORM.

## Tech Stack

- **ORM:** Prisma 7
- **Database:** PostgreSQL 14+
- **Type Safety:** Generated TypeScript types

---

## DESIGN PROCESS: STEP BY STEP

Berikut adalah alur desain database dari MVP Auth hingga final schema.

### Step 1: MVP - Authentication (CURRENT)

Mulai dengan yang paling dasar: **Users & Authentication**

**Pertanyaan desain:**

- Apa yang dibutuhkan untuk auth?
  - Email & password (auth)
  - Profil (name, bio, avatar)
  - Email verification
  - Refresh token untuk JWT

**Implementasi saat ini:**

```bash
# Buat migration untuk auth
bunx prisma migrate dev --name init_auth
```

**Schema Prisma:**

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// Users & Authentication (MVP)
model User {
  id            String   @id @default(uuid())
  name          String?
  email         String   @unique
  password_hash String

  avatar        String?
  bio           String?  @db.Text

  email_verified Boolean @default(false)

  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  // Relations
  refreshTokens RefreshToken[]

  @@map("users")
  @@index([email])
}

// Refresh Tokens
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

**Generated Tables:**

- `users` - User data dengan auth fields
- `refresh_tokens` - Refresh token untuk JWT authentication

---

### Step 2: Add Role-Based Access Control (RBAC)

Setelah auth dasar, tambahkan system role & permission.

**Pertanyaan desain:**

- Apakah butuh role-based access?
  - Ya, untuk membedakan reader, author, admin
- Butuh permission granular?
  - Ya, untuk kontrol akses yang fleksibel

**Migration:**

```bash
bunx prisma migrate dev --name add_rbac
```

**Schema tambahan:**

```prisma
model Role {
  id          String   @id @default(uuid())
  name        String   @unique
  displayName String
  description String?  @db.Text
  level       Int      @default(1)

  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  // Relations
  userRoles       UserRole[]
  rolePermissions RolePermission[]

  @@map("roles")
  @@index([name])
}

model Permission {
  id          String   @id @default(uuid())
  name        String   @unique
  displayName String
  description String?  @db.Text
  resource    String
  action      String

  created_at DateTime @default(now())

  // Relations
  rolePermissions RolePermission[]

  @@map("permissions")
  @@index([name])
}

model RolePermission {
  role_id       String
  permission_id String
  created_at    DateTime @default(now())

  role       Role       @relation(fields: [role_id], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permission_id], references: [id], onDelete: Cascade)

  @@id([role_id, permission_id])
  @@map("role_permissions")
  @@index([role_id])
  @@index([permission_id])
}

model UserRole {
  user_id     String
  role_id     String
  assigned_by String?
  reason      String?   @db.Text
  assigned_at DateTime  @default(now())

  user User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  role Role @relation(fields: [role_id], references: [id], onDelete: Cascade)

  @@id([user_id, role_id])
  @@map("user_roles")
  @@index([user_id])
  @@index([role_id])
}
```

**Update User model:**

```prisma
model User {
  // ... existing fields ...

  // Tambah relations RBAC
  userRoles UserRole[]

  // ... rest of fields ...
}
```

---

### Step 3: Design Articles - Core Content

Tambahkan entitas utama: **Articles**

**Pertanyaan desain:**

- Article punya author? → Ya, relasi ke User
- Article butuh kategori? → Ya (step selanjutnya)
- Content type? → Quill Delta, HTML, atau Markdown
- Status? → Draft atau Published

**Migration:**

```bash
bunx prisma migrate dev --name add_articles
```

**Schema tambahan:**

```prisma
enum ContentType {
  QUILL_DELTA
  HTML
  MARKDOWN
}

enum ArticleStatus {
  DRAFT
  PUBLISHED
}

model Article {
  id            String        @id @default(uuid())
  title         String
  slug          String        @unique
  content       String        @db.Text
  contentType   ContentType   @default(QUILL_DELTA)

  contentHtml   String?       @db.Text
  contentPlain  String?       @db.Text
  excerpt       String?       @db.VarChar(500)

  featuredImage String?

  status        ArticleStatus @default(DRAFT)
  publishedAt   DateTime?

  wordCount     Int           @default(0)
  readingTime   Int           @default(0)
  viewCount     Int           @default(0)

  authorId      String

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  deletedAt     DateTime?

  // Relations
  author User @relation(fields: [authorId], references: [id])

  @@map("articles")
  @@index([slug])
  @@index([authorId])
  @@index([status])
  @@index([publishedAt])
  @@index([createdAt])
}
```

**Update User model:**

```prisma
model User {
  // ... existing fields ...

  // Tambah relations Articles
  articles Article[]

  // ... rest of fields ...
}
```

---

### Step 4: Add Categories & Tags

**Pertanyaan desain:**

- Categories: Hierarchy atau flat? → Hierarchy (parent-child)
- Tags: Bisa banyak per article? → Ya, many-to-many

**Migration:**

```bash
bunx prisma migrate dev --name add_categories_tags
```

**Schema tambahan:**

```prisma
model Category {
  id              String    @id @default(uuid())
  name            String
  slug            String    @unique
  description     String?   @db.Text

  parentId        String?

  metaTitle       String?   @db.VarChar(200)
  metaDescription String?   @db.VarChar(500)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  articles Article[]

  @@map("categories")
  @@index([slug])
  @@index([parentId])
}

model Tag {
  id              String   @id @default(uuid())
  name            String
  slug            String   @unique
  description     String?  @db.Text
  color           String?  @db.VarChar(7)

  metaTitle       String?  @db.VarChar(200)
  metaDescription String?  @db.VarChar(500)

  articleCount    Int      @default(0)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  articles ArticleTag[]

  @@map("tags")
  @@index([slug])
}

model ArticleTag {
  articleId String
  tagId     String
  createdAt DateTime @default(now())

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  tag     Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([articleId, tagId])
  @@map("article_tags")
  @@index([articleId])
  @@index([tagId])
}
```

**Update Article model:**

```prisma
model Article {
  // ... existing fields ...

  categoryId String

  // Relations
  category Category  @relation(fields: [categoryId], references: [id])
  tags     ArticleTag[]

  // ... rest of fields ...

  @@index([categoryId])
}
```

---

### Step 5: Add Comments System

**Pertanyaan desain:**

- Comments punya replies? → Ya, self-reference (parent-child)
- Comments bisa dilike? → Ya, butuh CommentLikes table

**Migration:**

```bash
bunx prisma migrate dev --name add_comments
```

**Schema tambahan:**

```prisma
enum CommentStatus {
  PENDING
  PUBLISHED
  SPAM
}

model Comment {
  id        String        @id @default(uuid())
  content   String        @db.Text

  articleId String
  userId    String
  parentId  String?

  status    CommentStatus @default(PUBLISHED)

  likeCount Int           @default(0)

  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  deletedAt DateTime?

  // Relations
  article Article   @relation(fields: [articleId], references: [id])
  user    User      @relation(fields: [userId], references: [id])
  parent  Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies Comment[] @relation("CommentReplies")
  likes   CommentLike[]

  @@map("comments")
  @@index([articleId])
  @@index([userId])
  @@index([parentId])
  @@index([status])
}

model CommentLike {
  commentId String
  userId    String
  createdAt DateTime @default(now())

  comment Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([commentId, userId])
  @@map("comment_likes")
  @@index([commentId])
  @@index([userId])
}
```

**Update User & Article models:**

```prisma
model User {
  // ... existing fields ...
  comments    Comment[]
  commentLikes CommentLike[]
  // ... rest of fields ...
}

model Article {
  // ... existing fields ...
  comments Comment[]
  // ... rest of fields ...
}
```

---

### Step 6: Add User Interactions

**Pertanyaan desain:**

- User bisa like article? → Ya
- User bisa bookmark article? → Ya
- Perlu tracking views? → Ya, untuk analytics

**Migration:**

```bash
bunx prisma migrate dev --name add_interactions
```

**Schema tambahan:**

```prisma
model ArticleLike {
  articleId String
  userId    String
  createdAt DateTime @default(now())

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([articleId, userId])
  @@map("article_likes")
  @@index([articleId])
  @@index([userId])
}

model ArticleBookmark {
  articleId String
  userId    String
  createdAt DateTime @default(now())

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([articleId, userId])
  @@map("article_bookmarks")
  @@index([articleId])
  @@index([userId])
}

model ArticleView {
  id        String   @id @default(uuid())
  articleId String
  userId    String?
  ipAddress String?  @db.VarChar(45)
  userAgent String?  @db.Text
  viewedAt  DateTime @default(now())

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  user    User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("article_views")
  @@index([articleId])
  @@index([userId])
  @@index([viewedAt])
}
```

**Update User & Article models:**

```prisma
model User {
  // ... existing fields ...
  articleLikes     ArticleLike[]
  articleBookmarks ArticleBookmark[]
  articleViews     ArticleView[]
  // ... rest of fields ...
}

model Article {
  // ... existing fields ...
  likes     ArticleLike[]
  bookmarks ArticleBookmark[]
  views     ArticleView[]
  // ... rest of fields ...
}
```

---

## COMPLETE SCHEMA

Setelah semua migration selesai, final schema akan seperti ini:

### Final Prisma Schema

```prisma
// Copy hasil akhir dari semua step di atas
```

---

## ER Diagram

```
Step 1 (MVP Auth):
Users (1) ----< (N) RefreshTokens

Step 2 (+RBAC):
Users (N) ----< (N) Roles ----< (N) Permissions

Step 3 (+Articles):
Users (1) ----< (N) Articles

Step 4 (+Categories & Tags):
Articles (N) ---- (1) Categories
Articles (N) ----< (N) Tags

Step 5 (+Comments):
Articles (N) ----< (N) Comments
Comments ----< CommentLikes

Step 6 (+Interactions):
Articles (N) ----< (N) ArticleViews
Articles (N) ----< (N) ArticleLikes
Articles (N) ----< (N) ArticleBookmarks
```

---

## Database Migrations

### Migration Files

```bash
prisma/
├── schema.prisma
└── migrations/
    ├── 20260121105133_init_auth/
    │   └── migration.sql          # Step 1: Users & RefreshTokens
    ├── 20260121xxxxx_add_rbac/
    │   └── migration.sql          # Step 2: RBAC
    ├── 20260121xxxxx_add_articles/
    │   └── migration.sql          # Step 3: Articles
    ├── 20260121xxxxx_add_categories_tags/
    │   └── migration.sql          # Step 4: Categories & Tags
    ├── 20260121xxxxx_add_comments/
    │   └── migration.sql          # Step 5: Comments
    └── 20260121xxxxx_add_interactions/
        └── migration.sql          # Step 6: Interactions
```

### Creating Migration

```bash
# Create migration
bunx prisma migrate dev --name migration_name

# Run migration (production)
bunx prisma migrate deploy

# Reset database (dev only)
bunx prisma migrate reset --force
```

---

## Seed Data

### Default Roles

```sql
INSERT INTO "roles" (name, "displayName", "description", "level") VALUES
  ('reader', 'Reader', 'Can read and interact with content', 1),
  ('author', 'Author', 'Can create and manage own content', 2),
  ('admin', 'Administrator', 'Full system access', 3);
```

### Default Permissions

```sql
INSERT INTO "permissions" (name, "displayName", "description", "resource", "action") VALUES
  -- Articles
  ('articles.view', 'View Articles', 'View published articles', 'articles', 'view'),
  ('articles.create', 'Create Articles', 'Create new articles', 'articles', 'create'),
  ('articles.update_own', 'Update Own Articles', 'Update own articles', 'articles', 'update_own'),
  ('articles.delete_own_draft', 'Delete Own Draft Articles', 'Delete own draft articles', 'articles', 'delete_own_draft'),
  ('articles.publish', 'Publish Articles', 'Publish or unpublish articles', 'articles', 'publish'),

  -- Categories
  ('categories.view', 'View Categories', 'View categories', 'categories', 'view'),

  -- Tags
  ('tags.view', 'View Tags', 'View tags', 'tags', 'view'),

  -- Comments
  ('comments.create', 'Create Comments', 'Create new comments', 'comments', 'create'),
  ('comments.edit_own', 'Edit Own Comments', 'Edit own comments', 'comments', 'edit_own'),
  ('comments.delete_own', 'Delete Own Comments', 'Delete own comments', 'comments', 'delete_own'),
```

---

## Connection String

### Environment Variables

```env
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog_hono"
```

### Prisma Client Generation

```bash
# Generate Prisma Client
bunx prisma generate

# Open Prisma Studio (DB GUI)
bunx prisma studio
```

---

## Summary

✅ **Current Step:** Step 1 - MVP Auth (Users & RefreshTokens)
✅ **ORM:** Prisma 7
✅ **Database:** PostgreSQL 14+
✅ **Migrations:** Step-by-step, modular
✅ **Type Safety:** Auto-generated TypeScript types

**Next Steps:**

1. ✅ Step 1: MVP Auth - DONE
2. ⏳ Step 2: RBAC
3. ⏳ Step 3: Articles
4. ⏳ Step 4: Categories & Tags
5. ⏳ Step 5: Comments
6. ⏳ Step 6: Interactions

Ready for implementation! 🚀
