<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PropertyType;
use App\Models\PropertyTypeTranslation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PropertyTypeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $lang = $request->get('lang', 'en');
            
            $propertyTypes = PropertyType::with(['translations.language'])
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->map(function ($type) use ($lang) {
                    return $this->formatPropertyTypeResponse($type, $lang);
                });

            return response()->json($propertyTypes);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch property types: ' . $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $lang = $request->get('lang', 'en');
            $propertyType = PropertyType::with(['translations.language'])->findOrFail($id);
            
            return response()->json($this->formatPropertyTypeResponse($propertyType, $lang));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Property type not found'], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,ico|max:2048',
                'is_active' => 'boolean',
                'sort_order' => 'integer',
                'translations' => 'required|array|min:1',
                'translations.*.language_code' => 'required|string|exists:languages,code',
                'translations.*.name' => 'required|string|max:255',
                'translations.*.description' => 'nullable|string',
            ]);

            // Get all active languages
            $activeLanguages = \App\Models\Language::where('is_active', true)->pluck('code')->toArray();
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

            // Handle icon upload
            $iconPath = null;
            if ($request->hasFile('icon')) {
                $iconPath = $request->file('icon')->store('property_types', 'public');
            }

            // Generate slug from first translation name
            $slug = Str::slug($validated['translations'][0]['name']);

            $propertyType = PropertyType::create([
                'slug' => $slug,
                'icon' => $iconPath,
                'is_active' => $validated['is_active'] ?? true,
                'sort_order' => $validated['sort_order'] ?? 0,
            ]);

            // Create translations
            foreach ($validated['translations'] as $translation) {
                $language = \App\Models\Language::where('code', $translation['language_code'])->first();
                
                if ($language) {
                    PropertyTypeTranslation::create([
                        'property_type_id' => $propertyType->id,
                        'language_id' => $language->id,
                        'name' => $translation['name'],
                        'description' => $translation['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            $languageCode = $request->input('lang', 'en');
            return response()->json(
                $this->formatPropertyTypeResponse($propertyType->fresh(['translations.language']), $languageCode),
                201
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create property type: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $propertyType = PropertyType::findOrFail($id);

            // Validate request
            $validated = $request->validate([
                'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'is_active' => 'boolean',
                'sort_order' => 'integer',
                'translations' => 'sometimes|array|min:1',
                'translations.*.language_code' => 'required_with:translations|string|exists:languages,code',
                'translations.*.name' => 'required_with:translations|string|max:255',
                'translations.*.description' => 'nullable|string',
            ]);

            // Get all active languages
            if (isset($validated['translations'])) {
                $activeLanguages = \App\Models\Language::where('is_active', true)->pluck('code')->toArray();
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
            }

            DB::beginTransaction();

            // Handle icon upload
            $iconPath = $propertyType->icon;
            if ($request->hasFile('icon')) {
                // Delete old icon if exists
                if ($propertyType->icon && \Storage::disk('public')->exists($propertyType->icon)) {
                    \Storage::disk('public')->delete($propertyType->icon);
                }
                $iconPath = $request->file('icon')->store('property_types', 'public');
            }

            $propertyType->update([
                'icon' => $iconPath,
                'is_active' => $validated['is_active'] ?? $propertyType->is_active,
                'sort_order' => $validated['sort_order'] ?? $propertyType->sort_order,
            ]);

            // Delete existing translations and create new ones if translations are provided
            if (isset($validated['translations'])) {
                $propertyType->translations()->delete();

                foreach ($validated['translations'] as $translation) {
                    $language = \App\Models\Language::where('code', $translation['language_code'])->first();
                    PropertyTypeTranslation::create([
                        'property_type_id' => $propertyType->id,
                        'language_id' => $language->id,
                        'name' => $translation['name'],
                        'description' => $translation['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            $languageCode = $request->input('lang', 'en');
            return response()->json(
                $this->formatPropertyTypeResponse($propertyType->fresh(['translations.language']), $languageCode)
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update property type: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $propertyType = PropertyType::findOrFail($id);
            $propertyType->delete();
            return response()->json(['message' => 'Property type deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete property type: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Format property type response with translations
     */
    private function formatPropertyTypeResponse($propertyType, $languageCode = 'en')
    {
        $translations = [];
        foreach ($propertyType->translations as $translation) {
            $translations[$translation->language->code] = [
                'name' => $translation->name,
                'description' => $translation->description,
            ];
        }

        $currentTranslation = $propertyType->translation($languageCode);

        return [
            'id' => $propertyType->id,
            'slug' => $propertyType->slug,
            'icon' => $propertyType->icon,
            'is_active' => $propertyType->is_active,
            'sort_order' => $propertyType->sort_order,
            'name' => $currentTranslation ? $currentTranslation->name : ($translations['en']['name'] ?? null),
            'description' => $currentTranslation ? $currentTranslation->description : ($translations['en']['description'] ?? null),
            'translations' => $translations,
            'created_at' => $propertyType->created_at,
            'updated_at' => $propertyType->updated_at,
        ];
    }

    /**
     * Format property type response with all translations.
     */
    private function formatPropertyTypeResponseWithAllTranslations($propertyType)
    {
        $propertyType->load('translations.language');

        $translations = [];
        foreach ($propertyType->translations as $translation) {
            $translations[$translation->language->code] = [
                'name' => $translation->name,
                'description' => $translation->description,
            ];
        }

        return [
            'id' => $propertyType->id,
            'slug' => $propertyType->slug,
            'icon' => $propertyType->icon,
            'is_active' => $propertyType->is_active,
            'sort_order' => $propertyType->sort_order,
            'translations' => $translations,
            'created_at' => $propertyType->created_at,
            'updated_at' => $propertyType->updated_at,
        ];
    }
}
