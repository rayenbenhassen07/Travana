<?php

namespace App\Http\Controllers;

use App\Models\FacilityCategory;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class FacilityCategoryController extends Controller
{
    /**
     * Display a listing of facility categories.
     */
    public function index(Request $request)
    {
        $languageCode = $request->query('language', 'en');

        $categories = FacilityCategory::with(['translations' => function ($query) use ($languageCode) {
            $query->whereHas('language', function ($q) use ($languageCode) {
                $q->where('code', $languageCode);
            })->with('language');
        }])->get();

        $formattedCategories = $categories->map(function ($category) use ($languageCode) {
            return $this->formatFacilityCategoryResponse($category, $languageCode);
        });

        return response()->json($formattedCategories);
    }

    /**
     * Store a newly created facility category.
     */
    public function store(Request $request)
    {
        // Get all active languages
        $activeLanguages = Language::where('is_active', true)->pluck('code')->toArray();

        // Validate request
        $validator = Validator::make($request->all(), [
            'translations' => 'required|json',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Parse translations
        $translations = json_decode($request->input('translations'), true);

        // Validate that all active languages have translations
        foreach ($activeLanguages as $langCode) {
            if (!isset($translations[$langCode]) || 
                empty($translations[$langCode]['name'])) {
                return response()->json([
                    'message' => "Translation for language '{$langCode}' is required.",
                    'errors' => [
                        'translations' => ["All active languages must have a name translation."]
                    ]
                ], 422);
            }
        }

        // Get the first translation name for slug generation (preferably English)
        $slugName = $translations['en']['name'] ?? $translations[array_key_first($translations)]['name'];
        
        // Create facility category
        $category = FacilityCategory::create([
            'slug' => Str::slug($slugName),
            'is_active' => $request->input('is_active', true),
        ]);

        // Create translations
        foreach ($translations as $langCode => $translationData) {
            $language = Language::where('code', $langCode)->first();
            
            if ($language) {
                $category->translations()->create([
                    'language_id' => $language->id,
                    'name' => $translationData['name'],
                    'description' => $translationData['description'] ?? null,
                ]);
            }
        }

        // Return formatted response with all translations
        return response()->json(
            $this->formatFacilityCategoryResponseWithAllTranslations($category),
            201
        );
    }

    /**
     * Display the specified facility category.
     */
    public function show($id, Request $request)
    {
        $languageCode = $request->query('language', 'en');

        $category = FacilityCategory::with(['translations' => function ($query) use ($languageCode) {
            $query->whereHas('language', function ($q) use ($languageCode) {
                $q->where('code', $languageCode);
            })->with('language');
        }])->findOrFail($id);

        return response()->json($this->formatFacilityCategoryResponse($category, $languageCode));
    }

    /**
     * Update the specified facility category.
     */
    public function update(Request $request, $id)
    {
        $category = FacilityCategory::findOrFail($id);

        // Get all active languages
        $activeLanguages = Language::where('is_active', true)->pluck('code')->toArray();

        // Validate request
        $validator = Validator::make($request->all(), [
            'translations' => 'required|json',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Parse translations
        $translations = json_decode($request->input('translations'), true);

        // Validate that all active languages have translations
        foreach ($activeLanguages as $langCode) {
            if (!isset($translations[$langCode]) || 
                empty($translations[$langCode]['name'])) {
                return response()->json([
                    'message' => "Translation for language '{$langCode}' is required.",
                    'errors' => [
                        'translations' => ["All active languages must have a name translation."]
                    ]
                ], 422);
            }
        }

        // Get the first translation name for slug generation (preferably English)
        $slugName = $translations['en']['name'] ?? $translations[array_key_first($translations)]['name'];
        
        // Update facility category
        $category->update([
            'slug' => Str::slug($slugName),
            'is_active' => $request->input('is_active', $category->is_active),
        ]);

        // Update translations
        foreach ($translations as $langCode => $translationData) {
            $language = Language::where('code', $langCode)->first();
            
            if ($language) {
                $category->translations()->updateOrCreate(
                    ['language_id' => $language->id],
                    [
                        'name' => $translationData['name'],
                        'description' => $translationData['description'] ?? null,
                    ]
                );
            }
        }

        // Return formatted response with all translations
        return response()->json(
            $this->formatFacilityCategoryResponseWithAllTranslations($category)
        );
    }

    /**
     * Remove the specified facility category.
     */
    public function destroy($id)
    {
        $category = FacilityCategory::findOrFail($id);
        $category->translations()->delete();
        $category->delete();

        return response()->json(['message' => 'Facility category deleted successfully']);
    }

    /**
     * Format facility category response for a specific language.
     */
    private function formatFacilityCategoryResponse($category, $languageCode = 'en')
    {
        $category->load('translations.language');
        
        $translations = [];
        foreach ($category->translations as $translation) {
            $translations[$translation->language->code] = [
                'name' => $translation->name,
                'description' => $translation->description,
            ];
        }

        $translation = $category->translations->first(function ($t) use ($languageCode) {
            return $t->language && $t->language->code === $languageCode;
        }) ?? $category->translations->first();

        return [
            'id' => $category->id,
            'slug' => $category->slug,
            'is_active' => $category->is_active,
            'name' => $translation->name ?? 'N/A',
            'description' => $translation->description ?? null,
            'translations' => $translations,
            'created_at' => $category->created_at,
            'updated_at' => $category->updated_at,
        ];
    }

    /**
     * Format facility category response with all translations.
     */
    private function formatFacilityCategoryResponseWithAllTranslations($category)
    {
        $category->load('translations.language');

        $translations = [];
        foreach ($category->translations as $translation) {
            $translations[$translation->language->code] = [
                'name' => $translation->name,
                'description' => $translation->description,
            ];
        }

        return [
            'id' => $category->id,
            'slug' => $category->slug,
            'is_active' => $category->is_active,
            'translations' => $translations,
            'created_at' => $category->created_at,
            'updated_at' => $category->updated_at,
        ];
    }
}
