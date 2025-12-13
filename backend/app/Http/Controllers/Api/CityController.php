<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CityController extends Controller
{
    public function index(Request $request)
    {
        $languageCode = $request->input('lang', 'en');
        
        $cities = City::with(['translations.language', 'properties'])
           
            ->get()
            ->map(function ($city) use ($languageCode) {
                return $this->formatCityResponse($city, $languageCode);
            });
            
        return response()->json($cities);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'slug' => 'required|string|unique:cities,slug',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'is_active' => 'boolean',
                'translations' => 'required|array|min:1',
                'translations.*.language_code' => 'required|string|exists:languages,code',
                'translations.*.name' => 'required|string|max:255',
            ]);

            // Get all active languages
            $activeLanguages = Language::where('is_active', true)->pluck('code')->toArray();
            $providedLanguages = array_column($validated['translations'], 'language_code');
            
            // Check if all active languages have translations
            $missingLanguages = array_diff($activeLanguages, $providedLanguages);
            if (!empty($missingLanguages)) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => [
                        'translations' => [
                            'Please provide translations for all languages: ' . implode(', ', $missingLanguages)
                        ]
                    ],
                ], 422);
            }

            DB::beginTransaction();

            $city = City::create([
                'slug' => $validated['slug'],
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Create translations
            foreach ($validated['translations'] as $translation) {
                $language = Language::where('code', $translation['language_code'])->first();
                $city->translations()->create([
                    'language_id' => $language->id,
                    'name' => $translation['name'],
                ]);
            }

            DB::commit();

            $languageCode = $request->input('lang', 'en');
            return response()->json(
                $this->formatCityResponse($city->fresh(['translations.language']), $languageCode),
                201
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create city',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Request $request, $id)
    {
        $languageCode = $request->input('lang', 'en');
        $city = City::with(['translations.language', 'properties'])->findOrFail($id);
        
        return response()->json($this->formatCityResponse($city, $languageCode));
    }

    public function update(Request $request, $id)
    {
        try {
            $city = City::findOrFail($id);

            $validated = $request->validate([
                'slug' => 'sometimes|required|string|unique:cities,slug,' . $id,
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'is_active' => 'boolean',
                'translations' => 'sometimes|array|min:1',
                'translations.*.language_code' => 'required_with:translations|string|exists:languages,code',
                'translations.*.name' => 'required_with:translations|string|max:255',
            ]);

            DB::beginTransaction();

            // Update city data
            $city->update([
                'slug' => $validated['slug'] ?? $city->slug,
                'latitude' => $validated['latitude'] ?? $city->latitude,
                'longitude' => $validated['longitude'] ?? $city->longitude,
                'is_active' => $validated['is_active'] ?? $city->is_active,
            ]);

            // Update translations if provided
            if (isset($validated['translations'])) {
                // Get all active languages
                $activeLanguages = Language::where('is_active', true)->pluck('code')->toArray();
                $providedLanguages = array_column($validated['translations'], 'language_code');
                
                // Check if all active languages have translations
                $missingLanguages = array_diff($activeLanguages, $providedLanguages);
                if (!empty($missingLanguages)) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Validation failed',
                        'errors' => [
                            'translations' => [
                                'Please provide translations for all languages: ' . implode(', ', $missingLanguages)
                            ]
                        ],
                    ], 422);
                }
                
                foreach ($validated['translations'] as $translation) {
                    $language = Language::where('code', $translation['language_code'])->first();
                    $city->translations()->updateOrCreate(
                        ['language_id' => $language->id],
                        ['name' => $translation['name']]
                    );
                }
            }

            DB::commit();

            $languageCode = $request->input('lang', 'en');
            return response()->json(
                $this->formatCityResponse($city->fresh(['translations.language']), $languageCode)
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'City not found',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update city',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $city = City::findOrFail($id);
            
            // Check if city has properties
            if ($city->properties()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete city with existing properties',
                    'error' => 'This city has ' . $city->properties()->count() . ' property(s) associated with it.',
                ], 409);
            }
            
            $city->delete();
            return response()->json(['message' => 'City deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'City not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete city',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Format city response with translations
     */
    private function formatCityResponse($city, $languageCode = 'en')
    {
        $translations = [];
        foreach ($city->translations as $translation) {
            $translations[$translation->language->code] = $translation->name;
        }

        return [
            'id' => $city->id,
            'slug' => $city->slug,
            'latitude' => $city->latitude,
            'longitude' => $city->longitude,
            'is_active' => $city->is_active,
            'name' => $city->getTranslatedName($languageCode) ?? $translations['en'] ?? null,
            'translations' => $translations,
            'properties_count' => $city->properties->count(),
            'created_at' => $city->created_at,
            'updated_at' => $city->updated_at,
        ];
    }
}
