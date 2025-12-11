# Multilingual Database Structure

This document explains the multilingual implementation for Cities and Currencies in the Travana application.

## Overview

The system uses a translation table pattern where:

- Core entity data is stored in the main table (`cities`, `currencies`)
- Translatable fields are stored in separate translation tables (`city_translations`, `currency_translations`)
- A `languages` table manages available languages

## Database Tables

### Languages Table

Stores all available languages in the system.

**Fields:**

- `id`: Primary key
- `code`: ISO language code (e.g., 'en', 'fr', 'ar')
- `name`: Language name in its native script
- `is_default`: Boolean flag for the default language
- `is_active`: Boolean flag to enable/disable languages
- `created_at`, `updated_at`: Timestamps

### Cities Table

Stores core city data (non-translatable fields).

**Fields:**

- `id`: Primary key
- `slug`: URL-friendly identifier (unique)
- `latitude`: Geographic latitude (nullable)
- `longitude`: Geographic longitude (nullable)
- `is_active`: Boolean flag to enable/disable cities
- `created_at`, `updated_at`: Timestamps

### City Translations Table

Stores city names in different languages.

**Fields:**

- `id`: Primary key
- `city_id`: Foreign key to cities table
- `language_id`: Foreign key to languages table
- `name`: City name in the specific language
- **Unique constraint:** (`city_id`, `language_id`) ensures one translation per language per city

### Currencies Table

Stores core currency data.

**Fields:**

- `id`: Primary key
- `code`: ISO currency code (e.g., 'USD', 'EUR', 'TND')
- `symbol`: Currency symbol (e.g., '$', '€', 'د.ت')
- `exchange_rate`: Exchange rate relative to base currency
- `is_default`: Boolean flag for the default currency
- `is_active`: Boolean flag to enable/disable currencies
- `created_at`, `updated_at`: Timestamps

### Currency Translations Table

Stores currency names in different languages.

**Fields:**

- `id`: Primary key
- `currency_id`: Foreign key to currencies table
- `language_id`: Foreign key to languages table
- `name`: Currency name in the specific language (e.g., "US Dollar", "Euro", "Dinar Tunisien")
- **Unique constraint:** (`currency_id`, `language_id`) ensures one translation per language per currency

## Models

### Language Model

- Location: `app/Models/Language.php`
- Relationships:
  - `cityTranslations()` - Has many CityTranslation
  - `currencyTranslations()` - Has many CurrencyTranslation

### City Model

- Location: `app/Models/City.php`
- Relationships:
  - `translations()` - Has many CityTranslation
  - `listings()` - Has many Listing
- Helper Methods:
  - `translation($languageCode)` - Get translation for specific language
  - `getTranslatedName($languageCode)` - Get translated name

### CityTranslation Model

- Location: `app/Models/CityTranslation.php`
- No timestamps
- Relationships:
  - `city()` - Belongs to City
  - `language()` - Belongs to Language

### Currency Model

- Location: `app/Models/Currency.php`
- Relationships:
  - `translations()` - Has many CurrencyTranslation
  - `listingReservations()` - Has many ListingReservation
- Helper Methods:
  - `translation($languageCode)` - Get translation for specific language
  - `getTranslatedName($languageCode)` - Get translated name

### CurrencyTranslation Model

- Location: `app/Models/CurrencyTranslation.php`
- No timestamps
- Relationships:
  - `currency()` - Belongs to Currency
  - `language()` - Belongs to Language

## Migration Order

The migrations are numbered to ensure proper execution order:

1. `2025_12_10_000001_create_languages_table.php` - Creates languages table
2. `2025_12_10_000002_modify_cities_table.php` - Modifies cities table
3. `2025_12_10_000003_create_city_translations_table.php` - Creates city_translations table
4. `2025_12_10_000004_modify_currencies_table.php` - Modifies currencies table
5. `2025_12_10_000005_create_currency_translations_table.php` - Creates currency_translations table

## Running Migrations

```bash
# Fresh migration (WARNING: This will drop all tables)
php artisan migrate:fresh

# Run new migrations only
php artisan migrate

# Seed languages
php artisan db:seed --class=LanguageSeeder
```

## Usage Examples

### Creating a City with Translations

```php
use App\Models\City;
use App\Models\Language;

// Create the city
$city = City::create([
    'slug' => 'tunis',
    'latitude' => 36.8065,
    'longitude' => 10.1815,
    'is_active' => true,
]);

// Get languages
$english = Language::where('code', 'en')->first();
$french = Language::where('code', 'fr')->first();
$arabic = Language::where('code', 'ar')->first();

// Add translations
$city->translations()->create([
    'language_id' => $english->id,
    'name' => 'Tunis',
]);

$city->translations()->create([
    'language_id' => $french->id,
    'name' => 'Tunis',
]);

$city->translations()->create([
    'language_id' => $arabic->id,
    'name' => 'تونس',
]);
```

### Creating a Currency with Translations

```php
use App\Models\Currency;
use App\Models\Language;

// Create the currency
$currency = Currency::create([
    'code' => 'TND',
    'symbol' => 'د.ت',
    'exchange_rate' => 3.10,
    'is_default' => true,
    'is_active' => true,
]);

// Get languages
$english = Language::where('code', 'en')->first();
$french = Language::where('code', 'fr')->first();
$arabic = Language::where('code', 'ar')->first();

// Add translations
$currency->translations()->create([
    'language_id' => $english->id,
    'name' => 'Tunisian Dinar',
]);

$currency->translations()->create([
    'language_id' => $french->id,
    'name' => 'Dinar Tunisien',
]);

$currency->translations()->create([
    'language_id' => $arabic->id,
    'name' => 'دينار تونسي',
]);
```

### Retrieving Translated Data

```php
// Get city with all translations
$city = City::with('translations.language')->find(1);

// Get city name in a specific language
$cityNameInFrench = $city->getTranslatedName('fr');

// Get translation object for a specific language
$frenchTranslation = $city->translation('fr');
echo $frenchTranslation->name;

// Same for currencies
$currency = Currency::with('translations.language')->find(1);
$currencyNameInArabic = $currency->getTranslatedName('ar');
```

### Querying with Translations

```php
// Get all active cities with English translations
$cities = City::where('is_active', true)
    ->with(['translations' => function ($query) {
        $query->whereHas('language', function ($q) {
            $q->where('code', 'en');
        });
    }])
    ->get();

// Get all currencies with their default language translation
$defaultLanguage = Language::where('is_default', true)->first();
$currencies = Currency::with(['translations' => function ($query) use ($defaultLanguage) {
    $query->where('language_id', $defaultLanguage->id);
}])->get();
```

## API Response Example

When building API endpoints, you might want to return data like this:

```json
{
  "id": 1,
  "slug": "tunis",
  "latitude": 36.8065,
  "longitude": 10.1815,
  "is_active": true,
  "translations": {
    "en": "Tunis",
    "fr": "Tunis",
    "ar": "تونس"
  }
}
```

You can achieve this with:

```php
public function show($id, Request $request)
{
    $languageCode = $request->input('lang', 'en');

    $city = City::with('translations.language')->findOrFail($id);

    $translations = [];
    foreach ($city->translations as $translation) {
        $translations[$translation->language->code] = $translation->name;
    }

    return response()->json([
        'id' => $city->id,
        'slug' => $city->slug,
        'latitude' => $city->latitude,
        'longitude' => $city->longitude,
        'is_active' => $city->is_active,
        'name' => $city->getTranslatedName($languageCode),
        'translations' => $translations,
    ]);
}
```

## Best Practices

1. **Always load translations eagerly** when you know you'll need them to avoid N+1 queries
2. **Use the helper methods** (`getTranslatedName()`, `translation()`) for cleaner code
3. **Validate language codes** before creating translations
4. **Ensure at least one translation exists** for the default language
5. **Index frequently queried fields** like `slug` and `code`

## Notes

- Translation tables don't have timestamps to reduce storage and complexity
- Unique constraints prevent duplicate translations for the same language
- Cascade deletes ensure orphaned translations are removed
- Helper methods default to English ('en') when no language code is provided
