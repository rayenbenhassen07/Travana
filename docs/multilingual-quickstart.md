# Multilingual System - Quick Start Guide

## 🚀 Quick Setup

### 1. Run Migrations

```bash
cd backend
php artisan migrate
```

This will create:

- ✅ `languages` table
- ✅ `city_translations` table
- ✅ `currency_translations` table
- ✅ Modify `cities` table (remove `name`, add `latitude`, `longitude`, `is_active`)
- ✅ Modify `currencies` table (remove `name`, `label`, add `code`, `is_default`, `is_active`)

### 2. Seed Languages

```bash
php artisan db:seed --class=LanguageSeeder
```

This creates 3 languages:

- 🇬🇧 English (en) - Default
- 🇫🇷 French (fr)
- 🇸🇦 Arabic (ar)

### 3. Seed Sample Data (Optional)

```bash
# Seed sample cities
php artisan db:seed --class=CitySeeder

# Seed sample currencies
php artisan db:seed --class=CurrencySeeder
```

---

## 📁 Files Created/Modified

### New Models (4)

- ✅ `app/Models/Language.php`
- ✅ `app/Models/CityTranslation.php`
- ✅ `app/Models/CurrencyTranslation.php`

### Updated Models (2)

- ✏️ `app/Models/City.php`
- ✏️ `app/Models/Currency.php`

### New Migrations (5)

- ✅ `2025_12_10_000001_create_languages_table.php`
- ✅ `2025_12_10_000002_modify_cities_table.php`
- ✅ `2025_12_10_000003_create_city_translations_table.php`
- ✅ `2025_12_10_000004_modify_currencies_table.php`
- ✅ `2025_12_10_000005_create_currency_translations_table.php`

### New Controllers (1)

- ✅ `app/Http/Controllers/Api/LanguageController.php`

### Updated Controllers (2)

- ✏️ `app/Http/Controllers/Api/CityController.php`
- ✏️ `app/Http/Controllers/Api/CurrencyController.php`

### New Seeders (4)

- ✅ `database/seeders/LanguageSeeder.php`
- ✅ `database/seeders/CitySeeder.php`
- ✅ `database/seeders/CurrencySeeder.php`
- ✅ `database/seeders/MigrateToMultilingualSeeder.php`

### Updated Seeders (1)

- ✏️ `database/seeders/DatabaseSeeder.php`

### Updated Routes (1)

- ✏️ `routes/api.php`

### Documentation (3)

- ✅ `docs/multilingual-system.md` - Technical documentation
- ✅ `docs/multilingual-api.md` - API documentation
- ✅ `docs/multilingual-quickstart.md` - This file

---

## 🔌 API Usage Examples

### Get Cities in French

```bash
curl http://localhost:8000/api/cities?lang=fr
```

### Get Currencies in Arabic

```bash
curl http://localhost:8000/api/currencies?lang=ar
```

### Create a City with Translations

```bash
curl -X POST http://localhost:8000/api/cities \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "sousse",
    "latitude": 35.8256,
    "longitude": 10.6369,
    "is_active": true,
    "translations": [
      {"language_code": "en", "name": "Sousse"},
      {"language_code": "fr", "name": "Sousse"},
      {"language_code": "ar", "name": "سوسة"}
    ]
  }'
```

### Create a Currency with Translations

```bash
curl -X POST http://localhost:8000/api/currencies \
  -H "Content-Type: application/json" \
  -d '{
    "code": "USD",
    "symbol": "$",
    "exchange_rate": 0.32,
    "is_default": false,
    "is_active": true,
    "translations": [
      {"language_code": "en", "name": "US Dollar"},
      {"language_code": "fr", "name": "Dollar Américain"},
      {"language_code": "ar", "name": "دولار أمريكي"}
    ]
  }'
```

---

## 🎯 Key Features

### 1. Language Parameter Support

All GET endpoints support `?lang=` parameter:

- `GET /api/cities?lang=en`
- `GET /api/cities?lang=fr`
- `GET /api/cities?lang=ar`

### 2. Full Translation Object

Responses include all translations:

```json
{
  "id": 1,
  "slug": "tunis",
  "name": "Tunis",
  "translations": {
    "en": "Tunis",
    "fr": "Tunis",
    "ar": "تونس"
  }
}
```

### 3. Model Helper Methods

```php
// Get translation for specific language
$city->getTranslatedName('fr'); // Returns "Tunis"

// Get translation object
$translation = $city->translation('ar');
echo $translation->name; // Returns "تونس"

// Get all translations
$city->translations; // Collection of all translations
```

### 4. Eager Loading Support

```php
// Load with translations
$cities = City::with('translations.language')->get();

// Load specific language translation
$cities = City::with(['translations' => function($query) {
    $query->whereHas('language', fn($q) => $q->where('code', 'fr'));
}])->get();
```

---

## 📝 Database Schema Summary

### languages

- `id`, `code` (unique), `name`, `is_default`, `is_active`

### cities

- `id`, `slug` (unique), `latitude`, `longitude`, `is_active`

### city_translations

- `id`, `city_id` (FK), `language_id` (FK), `name`
- Unique: (`city_id`, `language_id`)

### currencies

- `id`, `code` (unique), `symbol`, `exchange_rate`, `is_default`, `is_active`

### currency_translations

- `id`, `currency_id` (FK), `language_id` (FK), `name`
- Unique: (`currency_id`, `language_id`)

---

## ⚠️ Important Notes

1. **Always seed languages first** before creating cities or currencies
2. **Default language** (English) is required and cannot be deleted
3. **Cascade deletes** are enabled - deleting a city/currency deletes its translations
4. **Unique constraint** - one translation per language per entity
5. **Translation tables** don't have timestamps for efficiency

---

## 🔧 Troubleshooting

### Migration Error: "Column not found"

Make sure you run migrations in order. If you get errors, try:

```bash
php artisan migrate:fresh
php artisan db:seed --class=LanguageSeeder
```

### "No default language set"

Run the language seeder:

```bash
php artisan db:seed --class=LanguageSeeder
```

### "Foreign key constraint fails"

Ensure languages table is populated before creating cities/currencies:

```bash
php artisan db:seed --class=LanguageSeeder
```

---

## 📚 Further Reading

- **Technical Details**: See `docs/multilingual-system.md`
- **API Documentation**: See `docs/multilingual-api.md`
- **Migration Guide**: See migration files in `database/migrations/`

---

## ✅ Testing Checklist

- [ ] Migrations run successfully
- [ ] Languages seeded (3 languages: en, fr, ar)
- [ ] Can create city with translations
- [ ] Can create currency with translations
- [ ] Can get cities with `?lang=fr` parameter
- [ ] Can get currencies with `?lang=ar` parameter
- [ ] Can update translations
- [ ] Cannot delete default language
- [ ] Cannot delete city with listings
- [ ] Cannot delete currency with reservations

---

## 🎉 You're Ready!

Your multilingual system is now set up. You can:

- ✅ Create cities/currencies with multiple language support
- ✅ Query data in any language
- ✅ Manage languages through the API
- ✅ Use helper methods in your controllers
- ✅ Build a fully multilingual application

For more examples and details, check the other documentation files!
