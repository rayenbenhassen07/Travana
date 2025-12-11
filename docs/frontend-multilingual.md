# Multilingual Frontend Implementation

## Overview

The frontend now supports multilingual cities with the following features:

- Add/Edit cities with translations in multiple languages
- Display cities with their translations
- Simple and clean UI with TranslationInput component

## Components Created

### 1. LanguageSelect Component

Location: `/src/components/shared/LanguageSelect.js`

A simple dropdown for selecting languages.

```jsx
import LanguageSelect from "@/components/shared/LanguageSelect";

<LanguageSelect
  value={selectedLang}
  onChange={setSelectedLang}
  languages={languages}
  error={error}
/>;
```

### 2. TranslationInput Component

Location: `/src/components/shared/TranslationInput.js`

Displays input fields for each language to add multilingual content.

```jsx
import TranslationInput from "@/components/shared/TranslationInput";

<TranslationInput
  languages={languages}
  translations={formData.translations}
  onChange={(translations) => setFormData({ ...formData, translations })}
  label="City Name"
  placeholder="Enter city name"
  errors={formErrors}
  required={true}
/>;
```

**Features:**

- Automatically creates an input for each language
- Shows language name next to each input
- Marks default language as required
- Displays validation errors per language

## Stores Updated

### 1. useLanguageStore

Location: `/src/store/useLanguageStore.js`

**Methods:**

- `fetchLanguages()` - Fetch all active languages
- `getDefaultLanguage()` - Get the default language
- `getLanguageByCode(code)` - Get language by code

**Usage:**

```jsx
const { languages, fetchLanguages } = useLanguageStore();

useEffect(() => {
  fetchLanguages();
}, []);
```

### 2. useCityStore (Updated)

Location: `/src/store/useCityStore.js`

**Updated Methods:**

- `fetchCities(lang)` - Now accepts optional language parameter
- `addCity(cityData)` - Now accepts full city object with translations
- `updateCity(id, cityData)` - Now accepts full city object with translations

**Usage:**

```jsx
// Add city with translations
const cityData = {
  slug: "tunis",
  latitude: 36.8065,
  longitude: 10.1815,
  is_active: true,
  translations: [
    { language_code: "en", name: "Tunis" },
    { language_code: "fr", name: "Tunis" },
    { language_code: "ar", name: "تونس" },
  ],
};

await addCity(cityData);
```

## City Form Structure

### Add/Edit City Form Data

```javascript
const [formData, setFormData] = useState({
  slug: "", // URL-friendly identifier
  latitude: "", // Optional
  longitude: "", // Optional
  is_active: true, // Default: active
  translations: {
    // Object with language codes as keys
    en: "",
    fr: "",
    ar: "",
  },
});
```

### Validation

- `slug` is required
- Default language translation is required
- Other language translations are optional
- Latitude/Longitude are optional

### Converting for API

The form converts translations from object to array format:

```javascript
// Form format (internal)
translations: {
  en: "Tunis",
  fr: "Tunis",
  ar: "تونس"
}

// API format (sent to backend)
translations: [
  { language_code: "en", name: "Tunis" },
  { language_code: "fr", name: "Tunis" },
  { language_code: "ar", name: "تونس" }
]
```

## API Response

Cities returned from the API include:

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

## User Flow

### Adding a City

1. User clicks "Add City"
2. Modal opens with form
3. User enters:
   - Slug (required)
   - Latitude/Longitude (optional)
   - City name in English (required)
   - City name in French (optional)
   - City name in Arabic (optional)
4. Form validates that slug and default language are filled
5. Submits to API
6. Success toast shown
7. City list refreshes

### Editing a City

1. User clicks edit button on a city
2. Modal opens with pre-filled data
3. All translations are loaded
4. User can modify any field
5. Submits changes
6. Success toast shown
7. City list updates

## Best Practices

### 1. Always Fetch Languages First

```jsx
useEffect(() => {
  fetchLanguages(); // Must be called before showing translation inputs
  fetchCities();
}, []);
```

### 2. Handle Missing Translations

```jsx
// Display city name with fallback
const cityName = city.translations?.en || city.name || "Unknown";
```

### 3. Validate Default Language

```jsx
const defaultLang = languages.find((lang) => lang.is_default);
if (defaultLang && !formData.translations[defaultLang.code]) {
  errors.translation = "Default language translation is required";
}
```

### 4. Show Translation Count

```jsx
{
  Object.keys(city.translations).length > 1 && (
    <span>{Object.keys(city.translations).length} languages</span>
  );
}
```

## Styling

The components use the existing design system:

- Neutral color palette
- Rounded corners (rounded-xl, rounded-lg)
- Consistent spacing
- Smooth transitions
- Accessible focus states

## Next Steps

To add multilingual support to other entities (like currencies, categories, etc.):

1. Create similar translation inputs in their forms
2. Update their Zustand stores to handle translations
3. Update their API calls to send translation arrays
4. Use the same TranslationInput component

Example for currencies:

```jsx
<TranslationInput
  languages={languages}
  translations={formData.translations}
  onChange={(translations) => setFormData({ ...formData, translations })}
  label="Currency Name"
  placeholder="Enter currency name"
  errors={formErrors}
/>
```

## Testing

1. ✅ Add a city with all languages filled
2. ✅ Add a city with only default language
3. ✅ Edit a city and change translations
4. ✅ Verify validation for required fields
5. ✅ Check that translations display correctly in the table
6. ✅ Verify language count badge shows correctly
