# Currencies & Listing Reservations

This document describes the structure and relationships for the `currencies` and `listings_reservations` tables.

---

## Tables Overview

### 1. Currencies Table (`currencies`)

Stores currency information for handling multi-currency reservations.

#### Structure

| Column        | Type          | Description                             |
| ------------- | ------------- | --------------------------------------- |
| id            | bigint (PK)   | Primary key                             |
| name          | string        | Currency name (e.g., "US Dollar")       |
| label         | string        | Currency label/code (e.g., "USD")       |
| symbol        | string        | Currency symbol (e.g., "$")             |
| exchange_rate | decimal(12,6) | Exchange rate relative to base currency |
| created_at    | timestamp     | Creation timestamp                      |
| updated_at    | timestamp     | Last update timestamp                   |

#### Example Data

| name            | label | symbol | exchange_rate |
| --------------- | ----- | ------ | ------------- |
| US Dollar       | USD   | $      | 1.000000      |
| Euro            | EUR   | €      | 0.920000      |
| Moroccan Dirham | MAD   | DH     | 10.050000     |
| British Pound   | GBP   | £      | 0.790000      |

---

### 2. Listing Reservations Table (`listings_reservations`)

Stores reservation/booking information for listings.

#### Structure

| Column      | Type            | Nullable | Description                                          |
| ----------- | --------------- | -------- | ---------------------------------------------------- |
| id          | bigint (PK)     | No       | Primary key                                          |
| ref         | string (unique) | No       | Auto-generated reference code (e.g., "RES-A1B2C3D4") |
| start_date  | date            | No       | Reservation start date                               |
| end_date    | date            | No       | Reservation end date                                 |
| is_blocked  | boolean         | No       | If true, this is a blocked date (not a real booking) |
| name        | string          | Yes\*    | Guest name                                           |
| phone       | string          | Yes\*    | Guest phone number                                   |
| email       | string          | Yes\*    | Guest email address                                  |
| sex         | enum            | Yes\*    | Guest sex ('male', 'female')                         |
| client_type | enum            | Yes\*    | Type of client ('family', 'group', 'one')            |
| nights      | integer         | No       | Number of nights                                     |
| total       | decimal(12,2)   | Yes\*    | Total price                                          |
| subtotal    | decimal(12,2)   | Yes\*    | Subtotal (before fees)                               |
| per_night   | decimal(12,2)   | Yes\*    | Price per night                                      |
| service_fee | decimal(12,2)   | Yes\*    | Service fee amount                                   |
| currency_id | bigint (FK)     | Yes\*    | Foreign key to currencies table                      |
| listing_id  | bigint (FK)     | No       | Foreign key to listings table                        |
| user_id     | bigint (FK)     | No\*\*   | Foreign key to users table (host/owner)              |
| created_at  | timestamp       | No       | Creation timestamp                                   |
| updated_at  | timestamp       | No       | Last update timestamp                                |

> **\* Nullable Logic:** When `is_blocked = true`, all fields marked with `*` can be null.  
> When `is_blocked = false`, all fields are required.
>
> **\*\*** `user_id` is always required regardless of `is_blocked` status.

---

## Relationships

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────────────┐       ┌─────────────┐
│   users     │       │  listings_reservations  │       │  listings   │
├─────────────┤       ├─────────────────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ user_id (FK)            │       │ id (PK)     │
│ name        │       │ listing_id (FK)         │──────►│ title       │
│ email       │       │ currency_id (FK)        │       │ user_id     │
│ ...         │       │ ref                     │       │ ...         │
└─────────────┘       │ start_date              │       └─────────────┘
                      │ end_date                │
                      │ is_blocked              │       ┌─────────────┐
                      │ name                    │       │ currencies  │
                      │ phone                   │       ├─────────────┤
                      │ email                   │       │ id (PK)     │
                      │ sex                     │◄──────│ name        │
                      │ client_type             │       │ label       │
                      │ nights                  │       │ symbol      │
                      │ total                   │       │ exchange_rate│
                      │ subtotal                │       └─────────────┘
                      │ per_night               │
                      │ service_fee             │
                      └─────────────────────────┘
```

### Relationship Definitions

#### Currency Model

```php
// Currency has many ListingReservations
public function listingReservations()
{
    return $this->hasMany(ListingReservation::class);
}
```

#### ListingReservation Model

```php
// ListingReservation belongs to User
public function user()
{
    return $this->belongsTo(User::class);
}

// ListingReservation belongs to Listing
public function listing()
{
    return $this->belongsTo(Listing::class);
}

// ListingReservation belongs to Currency
public function currency()
{
    return $this->belongsTo(Currency::class);
}
```

#### Listing Model

```php
// Listing has many ListingReservations
public function reservations()
{
    return $this->hasMany(ListingReservation::class);
}
```

#### User Model

```php
// User has many ListingReservations
public function listingReservations()
{
    return $this->hasMany(ListingReservation::class);
}
```

---

## Validation Rules

The `ListingReservation` model includes a static method `validationRules()` that returns different validation rules based on the `is_blocked` status:

### When `is_blocked = false` (Regular Booking)

All fields are **required**:

-   `start_date`, `end_date`, `name`, `phone`, `email`, `sex`, `client_type`
-   `nights`, `total`, `subtotal`, `per_night`, `service_fee`
-   `currency_id`, `listing_id`, `user_id`

### When `is_blocked = true` (Blocked Dates)

Only these fields are **required**:

-   `start_date`, `end_date`, `is_blocked`, `listing_id`, `user_id`, `nights`

All other fields are **optional**.

---

## Reference Code Generation

The `ref` field is auto-generated when creating a new reservation using the following format:

```
RES-XXXXXXXX
```

Where `XXXXXXXX` is an 8-character random alphanumeric string (uppercase).

Example: `RES-A1B2C3D4`, `RES-XY7Z9W2K`

The generation happens automatically in the model's `creating` event:

```php
protected static function boot()
{
    parent::boot();

    static::creating(function ($reservation) {
        if (empty($reservation->ref)) {
            $reservation->ref = self::generateRef();
        }
    });
}
```

---

## Usage Examples

### Creating a Regular Reservation

```php
$reservation = ListingReservation::create([
    'start_date' => '2025-12-15',
    'end_date' => '2025-12-20',
    'is_blocked' => false,
    'name' => 'John Doe',
    'phone' => '+1234567890',
    'email' => 'john@example.com',
    'sex' => 'male',
    'client_type' => 'family',
    'nights' => 5,
    'total' => 750.00,
    'subtotal' => 700.00,
    'per_night' => 140.00,
    'service_fee' => 50.00,
    'currency_id' => 1,
    'listing_id' => 1,
    'user_id' => 1,
]);
// ref will be auto-generated, e.g., "RES-A1B2C3D4"
```

### Creating a Blocked Date Range

```php
$blockedDates = ListingReservation::create([
    'start_date' => '2025-12-25',
    'end_date' => '2025-12-31',
    'is_blocked' => true,
    'nights' => 6,
    'listing_id' => 1,
    'user_id' => 1,
]);
```

### Fetching Reservations with Relations

```php
// Get all reservations for a listing with currency info
$reservations = ListingReservation::with(['currency', 'user'])
    ->where('listing_id', $listingId)
    ->where('is_blocked', false)
    ->get();

// Get blocked dates for a listing
$blockedDates = ListingReservation::where('listing_id', $listingId)
    ->where('is_blocked', true)
    ->get();
```
