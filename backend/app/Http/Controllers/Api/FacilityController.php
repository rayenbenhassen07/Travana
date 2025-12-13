<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\FacilityTranslation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        try {
            $lang = $request->get('lang', 'en');
            
            $facilities = Facility::with(['translations.language', 'category.translations.language'])
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->map(function ($facility) use ($lang) {
                    return $this->formatFacilityResponse($facility, $lang);
                });

            return response()->json($facilities);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch facilities: ' . $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $lang = $request->get('lang', 'en');
            $facility = Facility::with(['translations.language', 'category.translations.language'])->findOrFail($id);
            
            return response()->json($this->formatFacilityResponse($facility, $lang));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Facility not found'], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'slug' => 'nullable|string|unique:facilities,slug',
                'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,ico|max:2048',
                'category_id' => 'required|exists:facility_categories,id',
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
                $iconPath = $request->file('icon')->store('facilities', 'public');
            }

            $facility = Facility::create([
                'slug' => $validated['slug'] ?? Str::slug($validated['translations'][0]['name']),
                'icon' => $iconPath,
                'category_id' => $validated['category_id'],
                'is_active' => $validated['is_active'] ?? true,
                'sort_order' => $validated['sort_order'] ?? 0,
            ]);

            foreach ($validated['translations'] as $translation) {
                $language = \App\Models\Language::where('code', $translation['language_code'])->first();
                
                if ($language) {
                    FacilityTranslation::create([
                        'facility_id' => $facility->id,
                        'language_id' => $language->id,
                        'name' => $translation['name'],
                        'description' => $translation['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            $languageCode = $request->input('lang', 'en');
            return response()->json(
                $this->formatFacilityResponse($facility->fresh(['translations.language', 'category.translations.language']), $languageCode),
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
            return response()->json(['error' => 'Failed to create facility: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $facility = Facility::findOrFail($id);

            $validated = $request->validate([
                'slug' => 'nullable|string|unique:facilities,slug,' . $id,
                'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,ico|max:2048',
                'category_id' => 'exists:facility_categories,id',
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
            $iconPath = $facility->icon;
            if ($request->hasFile('icon')) {
                // Delete old icon if exists
                if ($facility->icon && \Storage::disk('public')->exists($facility->icon)) {
                    \Storage::disk('public')->delete($facility->icon);
                }
                $iconPath = $request->file('icon')->store('facilities', 'public');
            }

            // Generate new slug from first translation if translations are being updated
            $newSlug = $facility->slug;
            if (isset($validated['translations'])) {
                $newSlug = $validated['slug'] ?? Str::slug($validated['translations'][0]['name']);
            }
            
            $facility->update([
                'slug' => $newSlug,
                'icon' => $iconPath,
                'category_id' => $validated['category_id'] ?? $facility->category_id,
                'is_active' => $validated['is_active'] ?? $facility->is_active,
                'sort_order' => $validated['sort_order'] ?? $facility->sort_order,
            ]);

            // Delete existing translations and create new ones if translations are provided
            if (isset($validated['translations'])) {
                $facility->translations()->delete();

                foreach ($validated['translations'] as $translation) {
                    $language = \App\Models\Language::where('code', $translation['language_code'])->first();
                    FacilityTranslation::create([
                        'facility_id' => $facility->id,
                        'language_id' => $language->id,
                        'name' => $translation['name'],
                        'description' => $translation['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            $languageCode = $request->input('lang', 'en');
            return response()->json(
                $this->formatFacilityResponse($facility->fresh(['translations.language', 'category.translations.language']), $languageCode)
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update facility: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $facility = Facility::findOrFail($id);
            $facility->delete();
            return response()->json(['message' => 'Facility deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete facility: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Format facility response with translations
     */
    private function formatFacilityResponse($facility, $languageCode = 'en')
    {
        $translations = [];
        foreach ($facility->translations as $translation) {
            $translations[$translation->language->code] = [
                'name' => $translation->name,
                'description' => $translation->description,
            ];
        }

        $currentTranslation = $facility->translation($languageCode);

        $categoryTranslation = $facility->category ? $facility->category->translation($languageCode) : null;
        
        return [
            'id' => $facility->id,
            'slug' => $facility->slug,
            'icon' => $facility->icon,
            'category_id' => $facility->category_id,
            'category' => $facility->category ? [
                'id' => $facility->category->id,
                'name' => $categoryTranslation ? $categoryTranslation->name : null,
            ] : null,
            'is_active' => $facility->is_active,
            'sort_order' => $facility->sort_order,
            'name' => $currentTranslation ? $currentTranslation->name : ($translations['en']['name'] ?? null),
            'description' => $currentTranslation ? $currentTranslation->description : ($translations['en']['description'] ?? null),
            'translations' => $translations,
            'created_at' => $facility->created_at,
            'updated_at' => $facility->updated_at,
        ];
    }
}