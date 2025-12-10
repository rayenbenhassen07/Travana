# Database Models

Documentation of all Eloquent models, their attributes, and relationships.

---

## User

**Table:** `users`

| Column            | Type      | Description             |
| ----------------- | --------- | ----------------------- |
| id                | bigint    | Primary key             |
| name              | string    | User's full name        |
| email             | string    | Email (unique)          |
| email_verified_at | timestamp | Email verification date |
| password          | string    | Hashed password         |
| type              | enum      | `user` or `admin`       |
| remember_token    | string    | Session token           |
| created_at        | timestamp |                         |
| updated_at        | timestamp |                         |

**Relationships:**

-   `listings()` - HasMany Listing
-   `reservations()` - HasMany Reservation
-   `blogs()` - HasMany Blog (as author)
-   `blogComments()` - HasMany BlogComment
-   `blogLikes()` - HasMany BlogLike
-   `blogCommentLikes()` - HasMany BlogCommentLike

---

## Category

**Table:** `categories`

| Column      | Type      | Description            |
| ----------- | --------- | ---------------------- |
| id          | bigint    | Primary key            |
| title       | string    | Category name (unique) |
| description | text      | Category description   |
| logo        | string    | Logo image path        |
| created_at  | timestamp |                        |
| updated_at  | timestamp |                        |

**Relationships:**

-   `listings()` - HasMany Listing

**Accessors:**

-   `logo` attribute returns full URL path when accessed

---

## City

**Table:** `cities`

| Column     | Type      | Description        |
| ---------- | --------- | ------------------ |
| id         | bigint    | Primary key        |
| name       | string    | City name (unique) |
| slug       | string    | URL-friendly name  |
| created_at | timestamp |                    |
| updated_at | timestamp |                    |

**Relationships:**

-   `listings()` - HasMany Listing

---

## Facility

**Table:** `facilities`

| Column      | Type      | Description            |
| ----------- | --------- | ---------------------- |
| id          | bigint    | Primary key            |
| title       | string    | Facility name (unique) |
| description | text      | Description            |
| logo        | string    | Icon/logo path         |
| created_at  | timestamp |                        |
| updated_at  | timestamp |                        |

**Relationships:**

-   `listings()` - BelongsToMany Listing (pivot: `facility_listing`)

---

## Alert

**Table:** `alerts`

| Column      | Type      | Description          |
| ----------- | --------- | -------------------- |
| id          | bigint    | Primary key          |
| title       | string    | Alert title (unique) |
| description | text      | Description          |
| logo        | string    | Icon path            |
| created_at  | timestamp |                      |
| updated_at  | timestamp |                      |

**Relationships:**

-   `listings()` - BelongsToMany Listing (pivot: `alert_listing`)

---

## Listing

**Table:** `listings`

| Column            | Type          | Description                  |
| ----------------- | ------------- | ---------------------------- |
| id                | bigint        | Primary key                  |
| title             | string        | Listing title                |
| short_description | string        | Brief description (max 500)  |
| long_description  | text          | Full description             |
| images            | json          | Array of image paths         |
| category_id       | bigint        | Foreign key to categories    |
| room_count        | integer       | Number of rooms              |
| bathroom_count    | integer       | Number of bathrooms          |
| guest_count       | integer       | Max guests                   |
| bed_count         | integer       | Number of beds               |
| city_id           | bigint        | Foreign key to cities        |
| adresse           | string        | Street address               |
| user_id           | bigint        | Foreign key to users (owner) |
| price             | decimal(10,2) | Price per night              |
| lat               | decimal(10,8) | Latitude                     |
| long              | decimal(11,8) | Longitude                    |
| created_at        | timestamp     |                              |
| updated_at        | timestamp     |                              |

**Relationships:**

-   `category()` - BelongsTo Category
-   `city()` - BelongsTo City
-   `user()` - BelongsTo User
-   `facilities()` - BelongsToMany Facility
-   `alerts()` - BelongsToMany Alert
-   `reservations()` - HasMany Reservation

**Casts:**

-   `images` - Cast to array

---

## Reservation

**Table:** `reservations`

| Column        | Type      | Description                 |
| ------------- | --------- | --------------------------- |
| id            | bigint    | Primary key                 |
| user_id       | bigint    | Foreign key (nullable)      |
| listing_id    | bigint    | Foreign key                 |
| start_date    | date      | Check-in date               |
| end_date      | date      | Check-out date              |
| prices        | json      | Price breakdown             |
| is_blocked    | boolean   | Block dates without booking |
| guest_details | json      | Guest information           |
| contact       | json      | Contact information         |
| guest_count   | integer   | Number of guests            |
| details       | text      | Additional details          |
| client_type   | enum      | `family`, `group`, `one`    |
| created_at    | timestamp |                             |
| updated_at    | timestamp |                             |

**Relationships:**

-   `listing()` - BelongsTo Listing
-   `user()` - BelongsTo User

**Casts:**

-   `prices` - Cast to array
-   `guest_details` - Cast to array
-   `contact` - Cast to array
-   `is_blocked` - Cast to boolean

---

## Blog

**Table:** `blogs`

| Column           | Type      | Description                 |
| ---------------- | --------- | --------------------------- |
| id               | bigint    | Primary key                 |
| title            | string    | Blog title                  |
| slug             | string    | URL-friendly title (unique) |
| excerpt          | text      | Short summary               |
| content          | longtext  | Full blog content           |
| main_image       | string    | Featured image path         |
| thumbnail        | string    | Thumbnail image path        |
| author_id        | bigint    | Foreign key to users        |
| views_count      | integer   | View counter                |
| likes_count      | integer   | Like counter                |
| comments_count   | integer   | Comment counter             |
| meta_title       | string    | SEO title                   |
| meta_description | text      | SEO description             |
| meta_keywords    | string    | SEO keywords                |
| published_at     | timestamp | Publish date (nullable)     |
| is_featured      | boolean   | Featured flag               |
| allow_comments   | boolean   | Comments enabled            |
| order            | integer   | Display order               |
| created_at       | timestamp |                             |
| updated_at       | timestamp |                             |

**Relationships:**

-   `author()` - BelongsTo User
-   `categories()` - BelongsToMany BlogCategory (pivot: `blog_blog_category`)
-   `tags()` - BelongsToMany BlogTag (pivot: `blog_blog_tag`)
-   `comments()` - HasMany BlogComment
-   `likes()` - HasMany BlogLike

**Scopes:**

-   `published()` - Where published_at is not null and <= now
-   `featured()` - Where is_featured = true

---

## BlogCategory

**Table:** `blog_categories`

| Column           | Type      | Description                |
| ---------------- | --------- | -------------------------- |
| id               | bigint    | Primary key                |
| name             | string    | Category name              |
| slug             | string    | URL-friendly name (unique) |
| description      | text      | Description                |
| icon             | string    | Icon class/name            |
| color            | string    | Hex color code             |
| meta_title       | string    | SEO title                  |
| meta_description | text      | SEO description            |
| is_active        | boolean   | Active status              |
| order            | integer   | Display order              |
| created_at       | timestamp |                            |
| updated_at       | timestamp |                            |

**Relationships:**

-   `blogs()` - BelongsToMany Blog

---

## BlogTag

**Table:** `blog_tags`

| Column      | Type      | Description                |
| ----------- | --------- | -------------------------- |
| id          | bigint    | Primary key                |
| name        | string    | Tag name                   |
| slug        | string    | URL-friendly name (unique) |
| description | text      | Description                |
| color       | string    | Hex color code             |
| usage_count | integer   | Times used                 |
| created_at  | timestamp |                            |
| updated_at  | timestamp |                            |

**Relationships:**

-   `blogs()` - BelongsToMany Blog

---

## BlogComment

**Table:** `blog_comments`

| Column      | Type      | Description                               |
| ----------- | --------- | ----------------------------------------- |
| id          | bigint    | Primary key                               |
| blog_id     | bigint    | Foreign key                               |
| user_id     | bigint    | Foreign key                               |
| parent_id   | bigint    | Foreign key (nullable, for replies)       |
| content     | text      | Comment content                           |
| status      | enum      | `pending`, `approved`, `rejected`, `spam` |
| likes_count | integer   | Like counter                              |
| created_at  | timestamp |                                           |
| updated_at  | timestamp |                                           |

**Relationships:**

-   `blog()` - BelongsTo Blog
-   `user()` - BelongsTo User
-   `parent()` - BelongsTo BlogComment
-   `replies()` - HasMany BlogComment (where parent_id = id)
-   `likes()` - HasMany BlogCommentLike

---

## BlogLike

**Table:** `blog_likes`

| Column     | Type      | Description |
| ---------- | --------- | ----------- |
| id         | bigint    | Primary key |
| blog_id    | bigint    | Foreign key |
| user_id    | bigint    | Foreign key |
| created_at | timestamp |             |
| updated_at | timestamp |             |

**Relationships:**

-   `blog()` - BelongsTo Blog
-   `user()` - BelongsTo User

**Constraints:**

-   Unique composite key on (blog_id, user_id)

---

## BlogCommentLike

**Table:** `blog_comment_likes`

| Column     | Type      | Description |
| ---------- | --------- | ----------- |
| id         | bigint    | Primary key |
| comment_id | bigint    | Foreign key |
| user_id    | bigint    | Foreign key |
| created_at | timestamp |             |
| updated_at | timestamp |             |

**Relationships:**

-   `comment()` - BelongsTo BlogComment
-   `user()` - BelongsTo User

**Constraints:**

-   Unique composite key on (comment_id, user_id)

---

## Pivot Tables

### facility_listing

Links facilities to listings.

| Column      | Type   |
| ----------- | ------ |
| facility_id | bigint |
| listing_id  | bigint |

### alert_listing

Links alerts to listings.

| Column     | Type   |
| ---------- | ------ |
| alert_id   | bigint |
| listing_id | bigint |

### blog_blog_category

Links blogs to categories.

| Column           | Type   |
| ---------------- | ------ |
| blog_id          | bigint |
| blog_category_id | bigint |

### blog_blog_tag

Links blogs to tags.

| Column      | Type   |
| ----------- | ------ |
| blog_id     | bigint |
| blog_tag_id | bigint |

---

## Entity Relationship Diagram

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│   User   │───────│ Listing  │───────│ Category │
└──────────┘       └──────────┘       └──────────┘
     │                  │
     │                  │
     ▼                  ▼
┌──────────┐       ┌──────────┐       ┌──────────┐
│  Blog    │       │Reservation│      │   City   │
└──────────┘       └──────────┘       └──────────┘
     │
     │
     ▼
┌──────────────────────────────────┐
│        Blog System               │
│  ┌────────────┐ ┌────────────┐  │
│  │BlogCategory│ │  BlogTag   │  │
│  └────────────┘ └────────────┘  │
│  ┌────────────┐ ┌────────────┐  │
│  │BlogComment │ │  BlogLike  │  │
│  └────────────┘ └────────────┘  │
└──────────────────────────────────┘

Listing ◄──► Facility (Many-to-Many)
Listing ◄──► Alert (Many-to-Many)
Blog ◄──► BlogCategory (Many-to-Many)
Blog ◄──► BlogTag (Many-to-Many)
```
