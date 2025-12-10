# Travana Backend API Documentation

Welcome to the Travana API documentation. This guide provides comprehensive information about the backend API for the Travana travel and vacation rental platform.

## Table of Contents

1. [Getting Started](./getting-started.md)
2. [Authentication](./authentication.md)
3. [API Reference](./api-reference.md)
4. [Models & Database](./models.md)
5. [Error Handling](./error-handling.md)

## Quick Links

-   **Swagger UI**: Access the interactive API documentation at `/api/documentation`
-   **OpenAPI JSON**: Download the OpenAPI spec at `/docs/api-docs.json`

## Overview

Travana is a travel and vacation rental platform that provides:

-   **Listings Management**: Create and manage property listings
-   **Reservations**: Book and manage property reservations
-   **Blog System**: Full-featured blog with categories, tags, comments, and likes
-   **User Management**: Authentication and user account management

## Tech Stack

-   **Framework**: Laravel 12
-   **PHP Version**: 8.2+
-   **Authentication**: Laravel Sanctum (Bearer Token)
-   **Database**: MySQL/PostgreSQL/SQLite
-   **API Documentation**: L5-Swagger (OpenAPI 3.0)

## Base URL

```
Development: http://localhost:8000/api
Production: https://api.travana.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {your-token}
```

See the [Authentication Guide](./authentication.md) for details on obtaining tokens.

## Quick Start

```bash
# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Seed sample data (optional)
php artisan db:seed

# Start development server
php artisan serve

# Access Swagger documentation
open http://localhost:8000/api/documentation
```

## API Modules

| Module                                                | Description                      | Auth Required |
| ----------------------------------------------------- | -------------------------------- | ------------- |
| [Authentication](./api-reference.md#authentication)   | User registration, login, logout | Partial       |
| [Users](./api-reference.md#users)                     | User management                  | No            |
| [Categories](./api-reference.md#categories)           | Listing categories               | No            |
| [Cities](./api-reference.md#cities)                   | City management                  | No            |
| [Facilities](./api-reference.md#facilities)           | Property facilities              | No            |
| [Alerts](./api-reference.md#alerts)                   | Property alerts/warnings         | No            |
| [Listings](./api-reference.md#listings)               | Property listings                | No            |
| [Reservations](./api-reference.md#reservations)       | Booking management               | No            |
| [Blogs](./api-reference.md#blogs)                     | Blog posts                       | Partial       |
| [Blog Categories](./api-reference.md#blog-categories) | Blog categories                  | Partial       |
| [Blog Tags](./api-reference.md#blog-tags)             | Blog tags                        | Partial       |
| [Blog Comments](./api-reference.md#blog-comments)     | Blog comments                    | Partial       |
| [Blog Likes](./api-reference.md#blog-likes)           | Blog likes                       | Yes           |

## Support

For questions or issues, please contact: support@travana.com
