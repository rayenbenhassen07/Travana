<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyTranslation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        try {
            $lang = $request->get('lang', 'en');
            
            $query = Property::with([
                'user', 
                'propertyType.translations.language', 
                'city.translations.language',
                'currency.translations.language',
                'facilities.translations.language',
                'alerts.translations.language',
                'translations.language'
            ]);

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->whereHas('translations', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('short_description', 'like', "%{$search}%");
                });
            }

            // Filters
            if ($request->has('property_type_id')) {
                $query->where('property_type_id', $request->property_type_id);
            }

            if ($request->has('city_id')) {
                $query->where('city_id', $request->city_id);
            }

            if ($request->has('listing_type')) {
                $query->where('listing_type', $request->listing_type);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('min_price') && $request->has('listing_type')) {
                $priceColumn = $request->listing_type === 'sale' ? 'sale_price' : 'rent_price_daily';
                $query->where($priceColumn, '>=', $request->min_price);
            }

            if ($request->has('max_price') && $request->has('listing_type')) {
                $priceColumn = $request->listing_type === 'sale' ? 'sale_price' : 'rent_price_daily';
                $query->where($priceColumn, '<=', $request->max_price);
            }

            if ($request->has('bedroom_count')) {
                $query->where('bedroom_count', '>=', $request->bedroom_count);
            }

            if ($request->has('guest_capacity')) {
                $query->where('guest_capacity', '>=', $request->guest_capacity);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $properties = $query->paginate($perPage);

            // Transform data with translations
            $properties->getCollection()->transform(function ($property) use ($lang) {
                return $this->formatPropertyResponse($property, $lang);
            });

            return response()->json($properties);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch properties: ' . $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $lang = $request->get('lang', 'en');
            
            $property = Property::with([
                'user', 
                'propertyType.translations.language', 
                'city.translations.language',
                'currency.translations.language',
                'facilities.translations.language',
                'alerts.translations.language',
                'translations.language'
            ])->findOrFail($id);

            return response()->json($this->formatPropertyResponse($property, $lang));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Property not found'], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'slug' => 'nullable|string|unique:properties,slug',
                'property_type_id' => 'required|exists:property_types,id',
                'user_id' => 'required|exists:users,id',
                'city_id' => 'required|exists:cities,id',
                'address' => 'nullable|string|max:500',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
                'room_count' => 'integer|min:1',
                'bedroom_count' => 'integer|min:1',
                'bathroom_count' => 'integer|min:1',
                'guest_capacity' => 'integer|min:1',
                'bed_count' => 'integer|min:1',
                'area_sqm' => 'nullable|numeric',
                'floor_number' => 'nullable|integer',
                'total_floors' => 'nullable|integer',
                'listing_type' => 'required|in:sale,rent,both',
                'sale_price' => 'nullable|numeric',
                'rent_price_daily' => 'nullable|numeric',
                'rent_price_weekly' => 'nullable|numeric',
                'rent_price_monthly' => 'nullable|numeric',
                'currency_id' => 'required|exists:currencies,id',
                'images' => 'nullable|array',
                'images.*' => 'image|max:2048',
                'video_url' => 'nullable|url',
                'year_built' => 'nullable|integer|min:1800|max:' . date('Y'),
                'last_renovated' => 'nullable|integer|min:1800|max:' . date('Y'),
                'is_verified' => 'boolean',
                'status' => 'required|in:active,inactive,sold,rented',
                'translations' => 'required|array',
                'translations.*.language_id' => 'required|exists:languages,id',
                'translations.*.name' => 'required|string|max:255',
                'translations.*.short_description' => 'nullable|string',
                'translations.*.long_description' => 'nullable|string',
                'facility_ids' => 'nullable|array',
                'facility_ids.*' => 'exists:facilities,id',
                'alert_ids' => 'nullable|array',
                'alert_ids.*' => 'exists:alerts,id',
            ]);

            DB::beginTransaction();

            // Handle image uploads
            $imageUrls = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('properties', 'public');
                    $imageUrls[] = $path;
                }
            }

            $property = Property::create([
                'slug' => $validated['slug'] ?? Str::slug(Str::random(10)),
                'property_type_id' => $validated['property_type_id'],
                'user_id' => $validated['user_id'],
                'city_id' => $validated['city_id'],
                'address' => $validated['address'] ?? null,
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
                'room_count' => $validated['room_count'] ?? 1,
                'bedroom_count' => $validated['bedroom_count'] ?? 1,
                'bathroom_count' => $validated['bathroom_count'] ?? 1,
                'guest_capacity' => $validated['guest_capacity'] ?? 1,
                'bed_count' => $validated['bed_count'] ?? 1,
                'area_sqm' => $validated['area_sqm'] ?? null,
                'floor_number' => $validated['floor_number'] ?? null,
                'total_floors' => $validated['total_floors'] ?? null,
                'listing_type' => $validated['listing_type'],
                'sale_price' => $validated['sale_price'] ?? null,
                'rent_price_daily' => $validated['rent_price_daily'] ?? null,
                'rent_price_weekly' => $validated['rent_price_weekly'] ?? null,
                'rent_price_monthly' => $validated['rent_price_monthly'] ?? null,
                'currency_id' => $validated['currency_id'],
                'images' => $imageUrls,
                'video_url' => $validated['video_url'] ?? null,
                'year_built' => $validated['year_built'] ?? null,
                'last_renovated' => $validated['last_renovated'] ?? null,
                'is_verified' => $validated['is_verified'] ?? false,
                'status' => $validated['status'],
            ]);

            // Create translations
            foreach ($validated['translations'] as $translation) {
                PropertyTranslation::create([
                    'property_id' => $property->id,
                    'language_id' => $translation['language_id'],
                    'name' => $translation['name'],
                    'short_description' => $translation['short_description'] ?? null,
                    'long_description' => $translation['long_description'] ?? null,
                ]);
            }

            // Attach facilities
            if (!empty($validated['facility_ids'])) {
                $property->facilities()->attach($validated['facility_ids']);
            }

            // Attach alerts
            if (!empty($validated['alert_ids'])) {
                $property->alerts()->attach($validated['alert_ids']);
            }

            DB::commit();

            return response()->json($property->load([
                'translations', 
                'facilities', 
                'alerts',
                'propertyType',
                'city',
                'user',
                'currency'
            ]), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create property: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $property = Property::findOrFail($id);

            $validated = $request->validate([
                'slug' => 'nullable|string|unique:properties,slug,' . $id,
                'property_type_id' => 'exists:property_types,id',
                'user_id' => 'exists:users,id',
                'city_id' => 'exists:cities,id',
                'address' => 'nullable|string|max:500',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
                'room_count' => 'integer|min:1',
                'bedroom_count' => 'integer|min:1',
                'bathroom_count' => 'integer|min:1',
                'guest_capacity' => 'integer|min:1',
                'bed_count' => 'integer|min:1',
                'area_sqm' => 'nullable|numeric',
                'floor_number' => 'nullable|integer',
                'total_floors' => 'nullable|integer',
                'listing_type' => 'in:sale,rent,both',
                'sale_price' => 'nullable|numeric',
                'rent_price_daily' => 'nullable|numeric',
                'rent_price_weekly' => 'nullable|numeric',
                'rent_price_monthly' => 'nullable|numeric',
                'currency_id' => 'exists:currencies,id',
                'images' => 'nullable|array',
                'images.*' => 'image|max:2048',
                'video_url' => 'nullable|url',
                'year_built' => 'nullable|integer|min:1800|max:' . date('Y'),
                'last_renovated' => 'nullable|integer|min:1800|max:' . date('Y'),
                'is_verified' => 'boolean',
                'status' => 'in:active,inactive,sold,rented',
                'translations' => 'array',
                'translations.*.language_id' => 'required|exists:languages,id',
                'translations.*.name' => 'required|string|max:255',
                'translations.*.short_description' => 'nullable|string',
                'translations.*.long_description' => 'nullable|string',
                'facility_ids' => 'nullable|array',
                'facility_ids.*' => 'exists:facilities,id',
                'alert_ids' => 'nullable|array',
                'alert_ids.*' => 'exists:alerts,id',
            ]);

            DB::beginTransaction();

            // Handle image uploads
            if ($request->hasFile('images')) {
                // Delete old images
                if ($property->images) {
                    foreach ($property->images as $oldImage) {
                        Storage::disk('public')->delete($oldImage);
                    }
                }

                $imageUrls = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('properties', 'public');
                    $imageUrls[] = $path;
                }
                $validated['images'] = $imageUrls;
            }

            $property->update(array_filter($validated, function ($key) {
                return !in_array($key, ['translations', 'facility_ids', 'alert_ids']);
            }, ARRAY_FILTER_USE_KEY));

            // Update translations
            if (isset($validated['translations'])) {
                $property->translations()->delete();
                foreach ($validated['translations'] as $translation) {
                    PropertyTranslation::create([
                        'property_id' => $property->id,
                        'language_id' => $translation['language_id'],
                        'name' => $translation['name'],
                        'short_description' => $translation['short_description'] ?? null,
                        'long_description' => $translation['long_description'] ?? null,
                    ]);
                }
            }

            // Update facilities
            if (isset($validated['facility_ids'])) {
                $property->facilities()->sync($validated['facility_ids']);
            }

            // Update alerts
            if (isset($validated['alert_ids'])) {
                $property->alerts()->sync($validated['alert_ids']);
            }

            DB::commit();

            return response()->json($property->load([
                'translations', 
                'facilities', 
                'alerts',
                'propertyType',
                'city',
                'user',
                'currency'
            ]));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update property: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $property = Property::findOrFail($id);
            
            // Delete images
            if ($property->images) {
                foreach ($property->images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }

            $property->delete();
            return response()->json(['message' => 'Property deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete property: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Format property response with translations
     */
    private function formatPropertyResponse($property, $languageCode = 'en')
    {
        $translations = [];
        foreach ($property->translations as $translation) {
            $translations[$translation->language->code] = [
                'name' => $translation->name,
                'short_description' => $translation->short_description,
                'long_description' => $translation->long_description,
            ];
        }

        $currentTranslation = $property->translation($languageCode);
        $typeTranslation = $property->propertyType->translation($languageCode);
        $cityTranslation = $property->city->translation($languageCode);

        return [
            'id' => $property->id,
            'slug' => $property->slug,
            'name' => $currentTranslation ? $currentTranslation->name : ($translations['en']['name'] ?? null),
            'short_description' => $currentTranslation ? $currentTranslation->short_description : ($translations['en']['short_description'] ?? null),
            'long_description' => $currentTranslation ? $currentTranslation->long_description : ($translations['en']['long_description'] ?? null),
            'property_type' => [
                'id' => $property->propertyType->id,
                'name' => $typeTranslation ? $typeTranslation->name : null,
                'slug' => $property->propertyType->slug,
                'icon' => $property->propertyType->icon,
            ],
            'city' => [
                'id' => $property->city->id,
                'name' => $cityTranslation ? $cityTranslation->name : null,
                'slug' => $property->city->slug,
            ],
            'user' => $property->user,
            'address' => $property->address,
            'latitude' => $property->latitude,
            'longitude' => $property->longitude,
            'room_count' => $property->room_count,
            'bedroom_count' => $property->bedroom_count,
            'bathroom_count' => $property->bathroom_count,
            'guest_capacity' => $property->guest_capacity,
            'bed_count' => $property->bed_count,
            'area_sqm' => $property->area_sqm,
            'floor_number' => $property->floor_number,
            'total_floors' => $property->total_floors,
            'listing_type' => $property->listing_type,
            'sale_price' => $property->sale_price,
            'rent_price_daily' => $property->rent_price_daily,
            'rent_price_weekly' => $property->rent_price_weekly,
            'rent_price_monthly' => $property->rent_price_monthly,
            'currency' => $property->currency,
            'images' => $property->images,
            'video_url' => $property->video_url,
            'year_built' => $property->year_built,
            'last_renovated' => $property->last_renovated,
            'is_verified' => $property->is_verified,
            'status' => $property->status,
            'facilities' => $property->facilities,
            'alerts' => $property->alerts,
            'translations' => $translations,
            'created_at' => $property->created_at,
            'updated_at' => $property->updated_at,
        ];
    }
}
