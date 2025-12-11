# Multilingual API Documentation

## Overview

This document describes the multilingual API endpoints for Cities, Currencies, and Languages in the Travana application.

## Language Parameter

Most endpoints support an optional `lang` query parameter to specify the desired language for responses:

```
GET /api/cities?lang=en
GET /api/cities?lang=fr
GET /api/currencies?lang=ar
```

**Default Language:** If no `lang` parameter is provided, English (`en`) is used by default.

**Available Languages:**

- `en` - English
- `fr` - Français (French)
- `ar` - العربية (Arabic)

---

## Language Endpoints

### Get Active Languages

**GET** `/api/languages`

Returns all active languages.

**Response:**

```json
[
  {
    "id": 1,
    "code": "en",
    "name": "English",
    "is_default": true,
    "is_active": true,
    "created_at": "2025-12-10T10:00:00.000000Z",
    "updated_at": "2025-12-10T10:00:00.000000Z"
  },
  {
    "id": 2,
    "code": "fr",
    "name": "Français",
    "is_default": false,
    "is_active": true,
    "created_at": "2025-12-10T10:00:00.000000Z",
    "updated_at": "2025-12-10T10:00:00.000000Z"
  }
]
```

### Get All Languages (Including Inactive)

**GET** `/api/languages/all`

Returns all languages, including inactive ones.

### Get Default Language

**GET** `/api/languages/default`

Returns the default language.

**Response:**

```json
{
  "id": 1,
  "code": "en",
  "name": "English",
  "is_default": true,
  "is_active": true,
  "created_at": "2025-12-10T10:00:00.000000Z",
  "updated_at": "2025-12-10T10:00:00.000000Z"
}
```

### Get Language by ID

**GET** `/api/languages/{id}`

Returns a specific language by ID.

### Create Language (Protected)

**POST** `/api/languages`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "code": "es",
  "name": "Español",
  "is_default": false,
  "is_active": true
}
```

**Response:** `201 Created`

### Update Language (Protected)

**PUT** `/api/languages/{id}`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Spanish",
  "is_active": true
}
```

### Set Default Language (Protected)

**POST** `/api/languages/{id}/set-default`

Sets a language as the default language (automatically deactivates the previous default).

**Headers:**

```
Authorization: Bearer {token}
```

### Delete Language (Protected)

**DELETE** `/api/languages/{id}`

**Note:** Cannot delete the default language or languages with existing translations.

---

## City Endpoints

### Get All Cities

**GET** `/api/cities?lang={code}`

Returns all active cities with translations.

**Query Parameters:**

- `lang` (optional): Language code (default: `en`)

**Response:**

```json
[
  {
    "id": 1,
    "slug": "tunis",
    "latitude": "36.80650000",
    "longitude": "10.18150000",
    "is_active": true,
    "name": "Tunis",
    "translations": {
      "en": "Tunis",
      "fr": "Tunis",
      "ar": "تونس"
    },
    "listings_count": 5,
    "created_at": "2025-12-10T10:00:00.000000Z",
    "updated_at": "2025-12-10T10:00:00.000000Z"
  }
]
```

### Get City by ID

**GET** `/api/cities/{id}?lang={code}`

**Query Parameters:**

- `lang` (optional): Language code (default: `en`)

**Response:**

```json
{
  "id": 1,
  "slug": "tunis",
  "latitude": "36.80650000",
  "longitude": "10.18150000",
  "is_active": true,
  "name": "Tunis",
  "translations": {
    "en": "Tunis",
    "fr": "Tunis",
    "ar": "تونس"
  },
  "listings_count": 5,
  "created_at": "2025-12-10T10:00:00.000000Z",
  "updated_at": "2025-12-10T10:00:00.000000Z"
}
```

### Create City

**POST** `/api/cities`

**Request Body:**

```json
{
  "slug": "hammamet",
  "latitude": 36.4,
  "longitude": 10.6167,
  "is_active": true,
  "translations": [
    {
      "language_code": "en",
      "name": "Hammamet"
    },
    {
      "language_code": "fr",
      "name": "Hammamet"
    },
    {
      "language_code": "ar",
      "name": "الحمامات"
    }
  ]
}
```

**Validation Rules:**

- `slug`: required, string, unique
- `latitude`: nullable, numeric, between -90 and 90
- `longitude`: nullable, numeric, between -180 and 180
- `is_active`: boolean (default: true)
- `translations`: required, array, minimum 1 translation
- `translations.*.language_code`: required, string, must exist in languages table
- `translations.*.name`: required, string, max 255 characters

**Response:** `201 Created`

### Update City

**PUT** `/api/cities/{id}`

**Request Body:**

```json
{
  "slug": "hammamet-updated",
  "latitude": 36.4,
  "longitude": 10.6167,
  "is_active": true,
  "translations": [
    {
      "language_code": "en",
      "name": "Hammamet Beach"
    }
  ]
}
```

**Note:**

- All fields are optional
- If translations are provided, they will be updated or created
- Existing translations not included in the request will remain unchanged

### Delete City

**DELETE** `/api/cities/{id}`

**Note:** Cannot delete cities with existing listings.

---

## Currency Endpoints

### Get All Currencies

**GET** `/api/currencies?lang={code}`

Returns all active currencies with translations.

**Query Parameters:**

- `lang` (optional): Language code (default: `en`)

**Response:**

```json
[
  {
    "id": 1,
    "code": "TND",
    "symbol": "د.ت",
    "exchange_rate": "1.000000",
    "is_default": true,
    "is_active": true,
    "name": "Tunisian Dinar",
    "translations": {
      "en": "Tunisian Dinar",
      "fr": "Dinar Tunisien",
      "ar": "دينار تونسي"
    },
    "created_at": "2025-12-10T10:00:00.000000Z",
    "updated_at": "2025-12-10T10:00:00.000000Z"
  }
]
```

### Get Currency by ID

**GET** `/api/currencies/{id}?lang={code}`

**Query Parameters:**

- `lang` (optional): Language code (default: `en`)

### Create Currency

**POST** `/api/currencies`

**Request Body:**

```json
{
  "code": "EUR",
  "symbol": "€",
  "exchange_rate": 0.3,
  "is_default": false,
  "is_active": true,
  "translations": [
    {
      "language_code": "en",
      "name": "Euro"
    },
    {
      "language_code": "fr",
      "name": "Euro"
    },
    {
      "language_code": "ar",
      "name": "يورو"
    }
  ]
}
```

**Validation Rules:**

- `code`: required, string, max 10 characters, unique
- `symbol`: required, string, max 10 characters
- `exchange_rate`: required, numeric, minimum 0
- `is_default`: boolean (default: false)
- `is_active`: boolean (default: true)
- `translations`: required, array, minimum 1 translation
- `translations.*.language_code`: required, string, must exist in languages table
- `translations.*.name`: required, string, max 255 characters

**Response:** `201 Created`

### Update Currency

**PUT** `/api/currencies/{id}`

**Request Body:**

```json
{
  "exchange_rate": 0.32,
  "translations": [
    {
      "language_code": "en",
      "name": "Euro Currency"
    }
  ]
}
```

**Note:**

- All fields are optional
- If translations are provided, they will be updated or created
- Existing translations not included in the request will remain unchanged

### Delete Currency

**DELETE** `/api/currencies/{id}`

**Note:** Cannot delete currencies with existing reservations.

---

## Error Responses

### Validation Error (422)

```json
{
  "message": "Validation failed",
  "errors": {
    "translations": ["The translations field is required."],
    "translations.0.language_code": ["The selected language code is invalid."]
  }
}
```

### Not Found (404)

```json
{
  "error": "City not found"
}
```

### Conflict (409)

```json
{
  "message": "Cannot delete city with existing listings",
  "error": "This city has 5 listing(s) associated with it."
}
```

### Server Error (500)

```json
{
  "error": "Failed to create city"
}
```

---

## Examples

### Creating a Multilingual City

```bash
curl -X POST http://localhost:8000/api/cities \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "djerba",
    "latitude": 33.8076,
    "longitude": 10.8451,
    "is_active": true,
    "translations": [
      {"language_code": "en", "name": "Djerba"},
      {"language_code": "fr", "name": "Djerba"},
      {"language_code": "ar", "name": "جربة"}
    ]
  }'
```

### Getting Cities in French

```bash
curl http://localhost:8000/api/cities?lang=fr
```

### Updating Only Currency Exchange Rate

```bash
curl -X PUT http://localhost:8000/api/currencies/1 \
  -H "Content-Type: application/json" \
  -d '{
    "exchange_rate": 3.15
  }'
```

### Adding a Translation to Existing City

```bash
curl -X PUT http://localhost:8000/api/cities/1 \
  -H "Content-Type: application/json" \
  -d '{
    "translations": [
      {"language_code": "es", "name": "Túnez"}
    ]
  }'
```

---

## Migration Guide

### Step 1: Run Migrations

```bash
cd backend
php artisan migrate
```

### Step 2: Seed Languages

```bash
php artisan db:seed --class=LanguageSeeder
```

### Step 3: (Optional) Seed Sample Data

```bash
php artisan db:seed --class=CitySeeder
php artisan db:seed --class=CurrencySeeder
```

### Step 4: (If you have existing data) Migrate Data

```bash
php artisan db:seed --class=MigrateToMultilingualSeeder
```

---

## Notes

1. **Language Parameter**: Always include the `lang` parameter in GET requests to receive data in the desired language.

2. **Default Values**: The `name` field in responses defaults to the requested language, falling back to English if the translation doesn't exist.

3. **All Translations**: The `translations` object in responses always contains all available translations for the resource.

4. **Partial Updates**: When updating cities or currencies, you don't need to provide all translations. Only provide the translations you want to update or add.

5. **Unique Constraints**: Each city/currency can have only one translation per language (enforced by database constraint).

6. **Default Language**: There must always be one default language. You cannot delete or deactivate the default language without setting another language as default first.

7. **Cascade Deletes**: Deleting a city or currency will automatically delete all its translations.
