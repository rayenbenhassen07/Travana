# Getting Started

This guide will help you set up and run the Travana backend API.

## Prerequisites

-   PHP 8.2 or higher
-   Composer
-   MySQL, PostgreSQL, or SQLite
-   Node.js (optional, for frontend assets)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd travana/back
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and configure the following:

```env
APP_NAME=Travana
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=travana
DB_USERNAME=root
DB_PASSWORD=

# Sanctum Configuration (for API tokens)
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Run Database Migrations

```bash
php artisan migrate
```

### 6. Create Storage Link

```bash
php artisan storage:link
```

### 7. Seed Sample Data (Optional)

```bash
php artisan db:seed
```

### 8. Start Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

## Accessing API Documentation

### Swagger UI

Open your browser and navigate to:

```
http://localhost:8000/api/documentation
```

This provides an interactive interface to:

-   Explore all API endpoints
-   Test API calls directly
-   View request/response schemas
-   Authenticate and test protected routes

### Regenerate Documentation

If you make changes to the API annotations, regenerate the docs:

```bash
php artisan l5-swagger:generate
```

## Testing the API

### Using cURL

```bash
# Get all categories
curl http://localhost:8000/api/categories

# Register a new user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using HTTPie

```bash
# Get all listings
http GET localhost:8000/api/listings

# Create a reservation (authenticated)
http POST localhost:8000/api/reservations \
  Authorization:"Bearer YOUR_TOKEN" \
  listing_id=1 \
  start_date=2025-12-01 \
  end_date=2025-12-07
```

## Project Structure

```
back/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/           # API Controllers
│   │   │   │   ├── AlertController.php
│   │   │   │   ├── BlogCategoryController.php
│   │   │   │   ├── BlogCommentController.php
│   │   │   │   ├── BlogController.php
│   │   │   │   ├── BlogLikeController.php
│   │   │   │   ├── BlogTagController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── CityController.php
│   │   │   │   ├── FacilityController.php
│   │   │   │   ├── ListingController.php
│   │   │   │   ├── ReservationController.php
│   │   │   │   └── UserController.php
│   │   │   └── Auth/          # Authentication Controllers
│   │   │       ├── AuthenticatedSessionController.php
│   │   │       └── RegisteredUserController.php
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/                # Eloquent Models
│   └── Providers/
├── config/
│   └── l5-swagger.php         # Swagger configuration
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── docs/                      # Documentation
├── routes/
│   ├── api.php               # API routes
│   └── auth.php              # Auth routes
├── storage/
│   └── api-docs/             # Generated Swagger docs
└── tests/
```

## Configuration Options

### CORS Configuration

Edit `config/cors.php` to configure allowed origins:

```php
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### Sanctum Configuration

Edit `config/sanctum.php` for token settings:

```php
'expiration' => null, // Tokens never expire by default
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost')),
```

## Common Commands

```bash
# Clear all caches
php artisan optimize:clear

# Run tests
php artisan test

# Check routes
php artisan route:list --path=api

# Generate Swagger docs
php artisan l5-swagger:generate

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

## Troubleshooting

### Storage Permission Issues

```bash
chmod -R 775 storage bootstrap/cache
```

### Swagger Not Generating

Ensure annotations are valid:

```bash
php artisan l5-swagger:generate --verbose
```

### CORS Issues

Make sure your frontend domain is listed in `config/cors.php` allowed_origins.

### 401 Unauthorized

-   Verify your token is valid
-   Check the token is passed correctly: `Authorization: Bearer {token}`
-   Ensure the route requires authentication

## Next Steps

-   Read the [Authentication Guide](./authentication.md)
-   Explore the [API Reference](./api-reference.md)
-   Understand the [Data Models](./models.md)
