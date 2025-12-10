# API Reference

Complete reference for all Travana API endpoints.

> **Interactive Documentation**: Access Swagger UI at `/api/documentation` for live testing.

---

## Authentication

### POST /api/auth/register

Register a new user.

**Request:**

```json
{
    "username": "string (required)",
    "email": "string (required, email)",
    "password": "string (required, min:8)",
    "password_confirmation": "string (required)"
}
```

**Response:** `201 Created`

```json
{
    "message": "User registered successfully",
    "user": { "id": 1, "name": "...", "email": "...", "type": "user" },
    "token": "1|abc..."
}
```

### POST /api/auth/login

Login with credentials.

**Request:**

```json
{
    "email": "string (required)",
    "password": "string (required)"
}
```

**Response:** `200 OK` - Same as register response

### GET /api/auth/me

Get current authenticated user. **🔒 Requires Auth**

**Response:** `200 OK`

```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "type": "user"
}
```

### POST /api/auth/logout

Logout current user. **🔒 Requires Auth**

**Response:** `200 OK`

```json
{ "message": "Logged out successfully" }
```

---

## Users

### GET /api/users

Get all users.

**Response:** `200 OK` - Array of User objects

### GET /api/users/{id}

Get a specific user.

**Parameters:**

-   `id` (path) - User ID

**Response:** `200 OK` - User object with listings and reservations

### POST /api/users

Create a new user.

**Request:**

```json
{
    "name": "string (required, max:255)",
    "email": "string (required, email, unique)",
    "password": "string (required, min:8)",
    "type": "string (required, enum: user|admin)"
}
```

**Response:** `201 Created`

### PUT /api/users/{id}

Update a user.

**Request:** (all fields optional)

```json
{
    "name": "string",
    "email": "string",
    "password": "string",
    "type": "string"
}
```

**Response:** `200 OK`

### DELETE /api/users/{id}

Delete a user (cannot delete self or users with data).

**Response:** `200 OK` | `403 Forbidden` | `409 Conflict`

---

## Categories

### GET /api/categories

Get all categories with listing count.

**Response:** `200 OK`

```json
[
    {
        "id": 1,
        "title": "Apartments",
        "description": "...",
        "logo": "uploads/categories/...",
        "listings_count": 15,
        "created_at": "...",
        "updated_at": "..."
    }
]
```

### GET /api/categories/{id}

Get a specific category.

### POST /api/categories

Create a category.

**Request:** `multipart/form-data`

-   `title` (required, string, max:255, unique)
-   `description` (optional, string)
-   `logo` (optional, file: jpeg,jpg,png,gif,svg, max:2MB)

**Response:** `201 Created`

### PUT /api/categories/{id}

Update a category. Also accepts POST with `_method=PUT` for file uploads.

### DELETE /api/categories/{id}

Delete a category (only if no listings exist).

**Response:** `200 OK` | `409 Conflict`

---

## Cities

### GET /api/cities

Get all cities.

### GET /api/cities/{id}

Get a specific city with listings.

### POST /api/cities

Create a city.

**Request:**

```json
{
    "name": "string (required, unique)",
    "slug": "string (optional, auto-generated)"
}
```

### PUT /api/cities/{id}

Update a city.

### DELETE /api/cities/{id}

Delete a city (only if no listings exist).

---

## Facilities

### GET /api/facilities

Get all facilities.

### GET /api/facilities/{id}

Get a specific facility.

### POST /api/facilities

Create a facility.

**Request:** `multipart/form-data`

-   `title` (required, string, unique)
-   `description` (optional, string)
-   `logo` (optional, file, max:2MB)

### PUT /api/facilities/{id}

Update a facility.

### DELETE /api/facilities/{id}

Delete a facility (only if not in use).

---

## Alerts

### GET /api/alerts

Get all alerts.

### GET /api/alerts/{id}

Get a specific alert.

### POST /api/alerts

Create an alert.

**Request:** `multipart/form-data`

-   `title` (required, string, unique)
-   `description` (optional, string)
-   `logo` (optional, file, max:2MB)

### PUT /api/alerts/{id}

Update an alert.

### DELETE /api/alerts/{id}

Delete an alert (only if not in use).

---

## Listings

### GET /api/listings

Get paginated listings with filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search in title, description, address |
| city_id | integer | Filter by city |
| category_id | integer | Filter by category |
| user_id | integer | Filter by owner |
| min_price | number | Minimum price |
| max_price | number | Maximum price |
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 10) |

**Response:**

```json
{
    "data": [
        /* Listing objects */
    ],
    "pagination": {
        "total": 50,
        "currentPage": 1,
        "totalPages": 5,
        "perPage": 10
    }
}
```

### GET /api/listings/{id}

Get a specific listing with all related data.

### POST /api/listings

Create a listing.

**Request:** `multipart/form-data`

```
title (required, string, max:255)
short_description (optional, string, max:500)
long_description (optional, string)
images[] (optional, files, max:5MB each)
category_id (required, integer)
room_count (optional, integer, min:1)
bathroom_count (optional, integer, min:1)
guest_count (optional, integer, min:1)
bed_count (optional, integer, min:1)
city_id (required, integer)
adresse (optional, string)
user_id (required, integer)
price (required, number, min:0)
lat (optional, number, -90 to 90)
long (optional, number, -180 to 180)
facilities[] (optional, integer array)
alerts[] (optional, integer array)
```

### PUT /api/listings/{id}

Update a listing.

**Additional field:**

-   `existing_images[]` - Array of existing image paths to keep

### DELETE /api/listings/{id}

Delete a listing (only if no reservations exist).

---

## Reservations

### GET /api/reservations

Get all reservations with optional date filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| start_date | date | Filter start (YYYY-MM-DD) |
| end_date | date | Filter end (YYYY-MM-DD) |

### GET /api/reservations/{id}

Get a specific reservation.

### POST /api/reservations

Create a reservation (with overlap checking).

**Request:**

```json
{
    "user_id": "integer (optional)",
    "listing_id": "integer (required)",
    "start_date": "date (required, after_or_equal:today)",
    "end_date": "date (required, after:start_date)",
    "prices": "object (optional)",
    "is_blocked": "boolean (optional)",
    "guest_details": "object (optional)",
    "contact": "object (optional)",
    "guest_count": "integer (optional, min:1)",
    "details": "string (optional)",
    "client_type": "string (optional, enum: family|group|one)"
}
```

**Note:** The system automatically checks for date overlaps. Same-day checkout/checkin is allowed.

### PUT /api/reservations/{id}

Update a reservation (with overlap checking).

### DELETE /api/reservations/{id}

Delete a reservation.

---

## Blogs

### GET /api/blogs

Get paginated blogs with filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search in title, excerpt, content |
| status | string | Filter: published, draft, scheduled |
| category | string | Filter by category slug |
| tag | string | Filter by tag slug |
| author_id | integer | Filter by author |
| featured | boolean | Featured only |
| sort_by | string | Sort field (default: published_at) |
| sort_order | string | asc or desc (default: desc) |
| per_page | integer | Items per page (default: 15) |

### GET /api/blogs/{identifier}

Get blog by ID or slug. Increments view count.

### GET /api/blogs/popular/list

Get popular blogs.

**Query Parameters:**

-   `limit` (integer, default: 10)
-   `days` (integer, default: 30) - Last N days

### GET /api/blogs/{identifier}/related

Get related blogs based on categories and tags.

### GET /api/blogs/category/{categorySlug}

Get blogs by category.

### GET /api/blogs/tag/{tagSlug}

Get blogs by tag.

### GET /api/blogs/author/{authorId}

Get blogs by author.

### GET /api/blogs/search/query

Advanced blog search with date range.

**Query Parameters:**

-   `q` (string) - Search query
-   `date_from` (date)
-   `date_to` (date)
-   Standard pagination/sorting params

### POST /api/blogs **🔒 Requires Auth**

Create a blog.

**Request:** `multipart/form-data`

```
title (required, string)
slug (optional, auto-generated)
excerpt (optional, string)
content (required, string)
main_image (optional, file, max:5MB)
thumbnail (optional, file, max:2MB)
author_id (required, integer)
category_ids[] (optional, integer array)
tag_ids[] (optional, integer array)
meta_title (optional, string, max:255)
meta_description (optional, string, max:500)
meta_keywords (optional, string)
published_at (optional, datetime) - NULL=draft, future=scheduled, past=published
is_featured (optional, boolean)
allow_comments (optional, boolean)
order (optional, integer)
```

### PUT /api/blogs/{id} **🔒 Requires Auth**

Update a blog.

### DELETE /api/blogs/{id} **🔒 Requires Auth**

Delete a blog.

---

## Blog Categories

### GET /api/blog-categories

Get all blog categories.

**Query Parameters:**

-   `active_only` (boolean)
-   `all` (boolean) - Return all without pagination
-   `per_page` (integer, default: 20)

### GET /api/blog-categories/{identifier}

Get category by ID or slug.

### POST /api/blog-categories **🔒 Requires Auth**

Create a blog category.

**Request:**

```json
{
    "name": "string (required)",
    "slug": "string (optional)",
    "description": "string (optional)",
    "icon": "string (optional, max:100)",
    "color": "string (optional, hex, max:7)",
    "meta_title": "string (optional)",
    "meta_description": "string (optional)",
    "is_active": "boolean (optional)",
    "order": "integer (optional)"
}
```

### PUT /api/blog-categories/{id} **🔒 Requires Auth**

Update a blog category.

### DELETE /api/blog-categories/{id} **🔒 Requires Auth**

Delete a blog category (only if no blogs associated).

---

## Blog Tags

### GET /api/blog-tags

Get all blog tags.

**Query Parameters:**

-   `search` (string) - Search by name
-   `sort_by` (string, default: usage_count)
-   `sort_order` (string, default: desc)
-   `all` (boolean)
-   `per_page` (integer, default: 50)

### GET /api/blog-tags/{identifier}

Get tag by ID or slug.

### GET /api/blog-tags/popular/list

Get popular tags.

**Query Parameters:**

-   `limit` (integer, default: 10)

### POST /api/blog-tags **🔒 Requires Auth**

Create a blog tag.

**Request:**

```json
{
    "name": "string (required)",
    "slug": "string (optional)",
    "description": "string (optional)",
    "color": "string (optional, hex)"
}
```

### PUT /api/blog-tags/{id} **🔒 Requires Auth**

Update a blog tag.

### DELETE /api/blog-tags/{id} **🔒 Requires Auth**

Delete a blog tag (only if no blogs associated).

---

## Blog Comments

### GET /api/blogs/{blogId}/comments

Get approved comments for a blog. Includes `user_liked` if authenticated.

**Query Parameters:**

-   `sort_by` (string, default: created_at)
-   `sort_order` (string, default: desc)
-   `all` (boolean)
-   `per_page` (integer, default: 20)

### POST /api/blogs/{blogId}/comments **🔒 Requires Auth**

Create a comment.

**Request:**

```json
{
    "content": "string (required, 3-2000 chars)",
    "parent_id": "integer (optional) - for replies"
}
```

### PUT /api/blogs/{blogId}/comments/{id} **🔒 Requires Auth**

Update your own comment.

### DELETE /api/blogs/{blogId}/comments/{id} **🔒 Requires Auth**

Delete your own comment.

### POST /api/blogs/{blogId}/comments/{id}/like **🔒 Requires Auth**

Toggle like on a comment.

**Response:**

```json
{
    "message": "Comment liked",
    "liked": true,
    "likes_count": 5
}
```

### GET /api/admin/comments **🔒 Requires Auth**

Get all comments (admin view).

**Query Parameters:**

-   `status` (string: pending, approved, rejected, spam)
-   `blog_id` (integer)
-   Standard sorting/pagination

### PATCH /api/admin/comments/{id}/status **🔒 Requires Auth**

Update comment status (admin).

**Request:**

```json
{
    "status": "string (required, enum: pending|approved|rejected|spam)"
}
```

---

## Blog Likes

### POST /api/blogs/{blogId}/like **🔒 Requires Auth**

Toggle like on a blog.

**Response:**

```json
{
    "message": "Blog liked",
    "liked": true,
    "likes_count": 42
}
```

### GET /api/blogs/{blogId}/like/check **🔒 Requires Auth**

Check if current user liked a blog.

**Response:**

```json
{
    "liked": true,
    "likes_count": 42
}
```

### GET /api/blogs/{blogId}/likes **🔒 Requires Auth**

Get paginated list of users who liked a blog.

---

## HTTP Status Codes

| Code | Description                                               |
| ---- | --------------------------------------------------------- |
| 200  | Success                                                   |
| 201  | Created                                                   |
| 400  | Bad Request                                               |
| 401  | Unauthorized (not authenticated)                          |
| 403  | Forbidden (not allowed)                                   |
| 404  | Not Found                                                 |
| 409  | Conflict (e.g., cannot delete resource with dependencies) |
| 422  | Validation Error                                          |
| 500  | Server Error                                              |
