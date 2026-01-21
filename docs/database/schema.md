# DATABASE SCHEMA

Database schema untuk Blog API menggunakan PostgreSQL dan Prisma ORM.

## Tech Stack

- **ORM:** Prisma 7
- **Database:** PostgreSQL 14+
- **Type Safety:** Generated TypeScript types

---

## IMPLEMENTATION ROADMAP

Berikut adalah roadmap lengkap database schema dari MVP hingga final implementation.

```
✅ Step 1: MVP Auth (CURRENT)
⏳ Step 2: RBAC System
⏳ Step 3: Articles
⏳ Step 4: Categories & Tags
⏳ Step 5: Comments
⏳ Step 6: Interactions
⏳ Step 7: Analytics
```

---

## ✅ STEP 1: MVP - Authentication (CURRENT)

**Status:** Implemented

**Tanggal:** 2025-01-21

**Pertanyaan desain:**

- Apa yang dibutuhkan untuk auth?
  - Email & password (auth)
  - Profil (name, bio, avatar)
  - Refresh token untuk JWT

### Prisma Schema

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
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

### Database Tables

#### users

User data dengan authentication fields.

| Column         | Type      | Nullable | Default         | Description               |
| -------------- | --------- | -------- | --------------- | ------------------------- |
| id             | uuid      | NO       | uuid_generate() | Primary key               |
| name           | varchar   | YES      | NULL            | User display name         |
| email          | varchar   | NO       | -               | Email (unique)            |
| password_hash  | varchar   | NO       | -               | Hashed password           |
| avatar         | varchar   | YES      | NULL            | Avatar URL                |
| bio            | text      | YES      | NULL            | User bio/description      |
| email_verified | boolean   | NO       | false           | Email verification status |
| created_at     | timestamp | NO       | now()           | Account creation date     |
| updated_at     | timestamp | NO       | now()           | Last update timestamp     |

**Indexes:**

- `email` - For fast login queries

#### refresh_tokens

Refresh tokens untuk JWT authentication.

| Column     | Type      | Nullable | Default         | Description             |
| ---------- | --------- | -------- | --------------- | ----------------------- |
| id         | uuid      | NO       | uuid_generate() | Primary key             |
| token      | varchar   | NO       | -               | Unique refresh token    |
| user_id    | uuid      | NO       | -               | Foreign key to users    |
| expires_at | timestamp | NO       | -               | Token expiration date   |
| revoked    | boolean   | NO       | false           | Token revocation status |
| created_at | timestamp | NO       | now()           | Token creation date     |

**Indexes:**

- `user_id` - For user's tokens lookup
- `token` - For token validation queries

**Relationships:**

- `user_id` → `users.id` (CASCADE DELETE)

### Migration

```bash
bunx prisma migrate dev --name init_auth
```

---

## ⏳ STEP 2: Role-Based Access Control (RBAC)

**Status:** NOT IMPLEMENTED

**Pertanyaan desain:**

- Apakah butuh role-based access?
  - Ya, untuk membedakan reader, author, admin
- Butuh permission granular?
  - Ya, untuk kontrol akses yang fleksibel

### Migration

```bash
bunx prisma migrate dev --name add_rbac
```

### Schema Tambahan

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

### Update User Model

```prisma
model User {
  // ... existing fields ...

  // Tambah relations RBAC
  userRoles UserRole[]

  // ... rest of fields ...
}
```

---

## ⏳ STEP 3: Articles

**Status:** NOT IMPLEMENTED

**Pertanyaan desain:**

- Article punya author? → Ya, relasi ke User
- Article butuh kategori? → Ya (step selanjutnya)
- Content type? → Quill Delta, HTML, atau Markdown
- Status? → Draft atau Published

### Migration

```bash
bunx prisma migrate dev --name add_articles
```

### Schema Tambahan

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

### Update User Model

```prisma
model User {
  // ... existing fields ...

  // Tambah relations Articles
  articles Article[]

  // ... rest of fields ...
}
```

---

## ⏳ STEP 4: Categories & Tags

**Status:** NOT IMPLEMENTED

**Pertanyaan desain:**

- Categories: Hierarchy atau flat? → Hierarchy (parent-child)
- Tags: Bisa banyak per article? → Ya, many-to-many

### Migration

```bash
bunx prisma migrate dev --name add_categories_tags
```

### Schema Tambahan

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

### Update Article Model

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

## ⏳ STEP 5: Comments

**Status:** NOT IMPLEMENTED

**Pertanyaan desain:**

- Comments punya replies? → Ya, self-reference (parent-child)
- Comments bisa dilike? → Ya, butuh CommentLikes table

### Migration

```bash
bunx prisma migrate dev --name add_comments
```

### Schema Tambahan

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

### Update User & Article Models

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

## ⏳ STEP 6: Interactions

**Status:** NOT IMPLEMENTED

**Pertanyaan desain:**

- User bisa like article? → Ya
- User bisa bookmark article? → Ya
- Perlu tracking views? → Ya, untuk analytics

### Migration

```bash
bunx prisma migrate dev --name add_interactions
```

### Schema Tambahan

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

### Update User & Article Models

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

## ⏳ STEP 7: Analytics

**Status:** NOT IMPLEMENTED

Analytics akan menggunakan aggregation data dari tables yang sudah ada (articles, article_views, etc.)

---

## ER Diagram

### Current (MVP)

```
Users (1) ----< (N) RefreshTokens
```

### Final (Complete)

```
Step 1: Users (1) ----< (N) RefreshTokens

Step 2: Users (N) ----< (N) Roles ----< (N) Permissions

Step 3: Users (1) ----< (N) Articles

Step 4: Articles (N) ---- (1) Categories
         Articles (N) ----< (N) Tags

Step 5: Articles (N) ----< (N) Comments
         Comments ----< CommentLikes

Step 6: Articles (N) ----< (N) ArticleViews
         Articles (N) ----< (N) ArticleLikes
         Articles (N) ----< (N) ArticleBookmarks
```

---

## Database Migrations

### Migration Files Structure

```bash
prisma/
├── schema.prisma
└── migrations/
    ├── 20260121105133_init_auth/
    │   └── migration.sql          # ✅ Step 1: Users & RefreshTokens
    ├── xxx_add_rbac/
    │   └── migration.sql          # ⏳ Step 2: RBAC
    ├── xxx_add_articles/
    │   └── migration.sql          # ⏳ Step 3: Articles
    ├── xxx_add_categories_tags/
    │   └── migration.sql          # ⏳ Step 4: Categories & Tags
    ├── xxx_add_comments/
    │   └── migration.sql          # ⏳ Step 5: Comments
    └── xxx_add_interactions/
        └── migration.sql          # ⏳ Step 6: Interactions
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

## Connection String

### Environment Variables

```env
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hono_rest"
```

### Prisma Client Generation

```bash
# Generate Prisma Client
bunx prisma generate

# Open Prisma Studio (DB GUI)
bunx prisma studio
```

---

## Design Notes

### Why Only Refresh Tokens in Database?

**Access Token** (NOT stored in DB):

- Self-contained JWT with user claims
- Stateless - server verifies signature only
- Short-lived (15-30 minutes)
- No database lookup needed

**Refresh Token** (stored in DB):

- Long-lived (7-30 days)
- Can be revoked for security
- Enables token rotation
- Stored for revocation tracking

### Password Security

- Passwords hashed with bcrypt (cost factor: 10)
- Never store plain text passwords
- Minimum 8 characters with complexity requirements

### Email Verification

- `email_verified` flag for verification status
- Can be set to true via verification endpoint (future feature)
- Currently defaults to false for MVP

---

## Summary

✅ **Current Step:** Step 1 - MVP Auth (Users & RefreshTokens)
✅ **ORM:** Prisma 7
✅ **Database:** PostgreSQL 14+
✅ **Migrations:** Step-by-step, modular
✅ **Type Safety:** Auto-generated TypeScript types

**Implementation Progress:**

1. ✅ Step 1: MVP Auth - DONE
2. ⏳ Step 2: RBAC
3. ⏳ Step 3: Articles
4. ⏳ Step 4: Categories & Tags
5. ⏳ Step 5: Comments
6. ⏳ Step 6: Interactions
7. ⏳ Step 7: Analytics

**Next Step:** Implement RBAC System

Ready for implementation! 🚀
