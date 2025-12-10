# Error Handling

Documentation of error responses and status codes used in the Travana API.

---

## Error Response Format

All error responses follow a consistent JSON structure:

### Standard Error

```json
{
    "message": "Human-readable error description"
}
```

### Validation Error (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "field_name": [
            "The field_name is required.",
            "The field_name must be at least 8 characters."
        ],
        "another_field": ["The another_field must be a valid email address."]
    }
}
```

---

## HTTP Status Codes

### Success Codes

| Code | Name       | Description                             |
| ---- | ---------- | --------------------------------------- |
| 200  | OK         | Request succeeded                       |
| 201  | Created    | Resource created successfully           |
| 204  | No Content | Request succeeded, no content to return |

### Client Error Codes

| Code | Name                 | Description                                  |
| ---- | -------------------- | -------------------------------------------- |
| 400  | Bad Request          | Invalid request syntax or parameters         |
| 401  | Unauthorized         | Authentication required or failed            |
| 403  | Forbidden            | Authenticated but not authorized             |
| 404  | Not Found            | Resource doesn't exist                       |
| 409  | Conflict             | Resource conflict (e.g., dependencies exist) |
| 422  | Unprocessable Entity | Validation failed                            |
| 429  | Too Many Requests    | Rate limit exceeded                          |

### Server Error Codes

| Code | Name                  | Description                    |
| ---- | --------------------- | ------------------------------ |
| 500  | Internal Server Error | Unexpected server error        |
| 503  | Service Unavailable   | Server temporarily unavailable |

---

## Common Error Scenarios

### Authentication Errors

**401 Unauthorized - No Token**

```json
{
    "message": "Unauthenticated."
}
```

**401 Unauthorized - Invalid Token**

```json
{
    "message": "Unauthenticated."
}
```

**401 Unauthorized - Invalid Credentials**

```json
{
    "message": "Invalid credentials"
}
```

### Validation Errors

**422 - Required Field Missing**

```json
{
    "message": "The email field is required.",
    "errors": {
        "email": ["The email field is required."]
    }
}
```

**422 - Invalid Format**

```json
{
    "message": "The email must be a valid email address.",
    "errors": {
        "email": ["The email must be a valid email address."]
    }
}
```

**422 - Unique Constraint**

```json
{
    "message": "The email has already been taken.",
    "errors": {
        "email": ["The email has already been taken."]
    }
}
```

**422 - File Validation**

```json
{
    "message": "The logo must be a file of type: jpeg, jpg, png, gif, svg.",
    "errors": {
        "logo": [
            "The logo must be a file of type: jpeg, jpg, png, gif, svg.",
            "The logo must not be greater than 2048 kilobytes."
        ]
    }
}
```

### Resource Errors

**404 - Not Found**

```json
{
    "message": "Listing not found"
}
```

**409 - Conflict (Dependencies)**

```json
{
    "message": "Cannot delete category with existing listings"
}
```

```json
{
    "message": "Cannot delete user with existing listings or reservations"
}
```

**403 - Forbidden (Self Action)**

```json
{
    "message": "You cannot delete yourself"
}
```

### Business Logic Errors

**409 - Reservation Overlap**

```json
{
    "message": "The listing is already reserved for the selected dates.",
    "conflicts": [
        {
            "id": 15,
            "start_date": "2024-03-10",
            "end_date": "2024-03-15"
        }
    ]
}
```

**403 - Comment Ownership**

```json
{
    "message": "You can only edit your own comments"
}
```

---

## Validation Rules Reference

### Common Validation Rules

| Rule                  | Description                | Example                                   |
| --------------------- | -------------------------- | ----------------------------------------- |
| `required`            | Field must be present      | `"title": ["required"]`                   |
| `string`              | Must be a string           | `"name": ["string"]`                      |
| `email`               | Must be valid email        | `"email": ["email"]`                      |
| `unique:table,column` | Must be unique in database | `"email": ["unique:users"]`               |
| `exists:table,column` | Must exist in database     | `"category_id": ["exists:categories,id"]` |
| `min:n`               | Minimum length/value       | `"password": ["min:8"]`                   |
| `max:n`               | Maximum length/value       | `"title": ["max:255"]`                    |
| `numeric`             | Must be numeric            | `"price": ["numeric"]`                    |
| `integer`             | Must be integer            | `"room_count": ["integer"]`               |
| `boolean`             | Must be boolean            | `"is_active": ["boolean"]`                |
| `date`                | Must be valid date         | `"start_date": ["date"]`                  |
| `after:date`          | Must be after date         | `"end_date": ["after:start_date"]`        |
| `in:a,b,c`            | Must be one of values      | `"type": ["in:user,admin"]`               |
| `file`                | Must be uploaded file      | `"logo": ["file"]`                        |
| `mimes:a,b`           | File type restriction      | `"logo": ["mimes:jpeg,png"]`              |
| `max:n` (file)        | Max file size in KB        | `"image": ["max:5120"]`                   |
| `array`               | Must be array              | `"facilities": ["array"]`                 |
| `confirmed`           | Field + \_confirmation     | `"password": ["confirmed"]`               |

### Resource-Specific Validation

#### User Registration

```
username: required|string|max:255
email: required|email|unique:users
password: required|string|min:8|confirmed
```

#### Listing Creation

```
title: required|string|max:255
category_id: required|exists:categories,id
city_id: required|exists:cities,id
user_id: required|exists:users,id
price: required|numeric|min:0
images.*: file|mimes:jpeg,jpg,png,gif|max:5120
lat: nullable|numeric|between:-90,90
long: nullable|numeric|between:-180,180
```

#### Reservation Creation

```
listing_id: required|exists:listings,id
start_date: required|date|after_or_equal:today
end_date: required|date|after:start_date
guest_count: nullable|integer|min:1
client_type: nullable|in:family,group,one
```

#### Blog Creation

```
title: required|string|max:255
slug: nullable|string|unique:blogs
content: required|string
author_id: required|exists:users,id
published_at: nullable|date
category_ids.*: exists:blog_categories,id
tag_ids.*: exists:blog_tags,id
main_image: nullable|image|max:5120
```

---

## Error Handling Best Practices

### Client-Side Handling

```javascript
try {
    const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();

        switch (response.status) {
            case 401:
                // Redirect to login
                break;
            case 422:
                // Display validation errors
                Object.entries(error.errors).forEach(([field, messages]) => {
                    showFieldError(field, messages[0]);
                });
                break;
            case 409:
                // Handle conflict (e.g., duplicate, dependencies)
                showAlert(error.message);
                break;
            default:
                showAlert("An error occurred");
        }
    }
} catch (e) {
    showAlert("Network error");
}
```

### Retry Strategy

For transient errors (5xx, network issues):

```javascript
async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status < 500) return response;
        } catch (e) {
            if (i === retries - 1) throw e;
        }
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
    }
}
```

---

## Debug Mode

In development (`APP_DEBUG=true`), error responses include additional details:

```json
{
  "message": "Server Error",
  "exception": "ErrorException",
  "file": "/app/Http/Controllers/ListingController.php",
  "line": 45,
  "trace": [...]
}
```

**Note:** Debug details are never exposed in production.
