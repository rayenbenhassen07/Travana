<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Language;
use Illuminate\Http\Request;

class LanguageController extends Controller
{
    /**
     * Display a listing of active languages.
     */
    public function index()
    {
        try {
            $languages = Language::where('is_active', true)
                ->orderBy('is_default', 'desc')
                ->orderBy('name')
                ->get();
                
            return response()->json($languages);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch languages'], 500);
        }
    }

    /**
     * Display a listing of all languages (including inactive).
     */
    public function all()
    {
        try {
            $languages = Language::orderBy('is_default', 'desc')
                ->orderBy('name')
                ->get();
                
            return response()->json($languages);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch languages'], 500);
        }
    }

    /**
     * Store a newly created language.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'code' => 'required|string|max:10|unique:languages,code',
                'name' => 'required|string|max:100',
                'is_default' => 'boolean',
                'is_active' => 'boolean',
            ]);

            // If this is set as default, remove default from others
            if (isset($validated['is_default']) && $validated['is_default']) {
                Language::where('is_default', true)->update(['is_default' => false]);
            }

            $language = Language::create($validated);
            return response()->json($language, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create language'], 500);
        }
    }

    /**
     * Display the specified language.
     */
    public function show($id)
    {
        try {
            $language = Language::findOrFail($id);
            return response()->json($language);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Language not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch language'], 500);
        }
    }

    /**
     * Update the specified language.
     */
    public function update(Request $request, $id)
    {
        try {
            $language = Language::findOrFail($id);

            $validated = $request->validate([
                'code' => 'sometimes|required|string|max:10|unique:languages,code,' . $id,
                'name' => 'sometimes|required|string|max:100',
                'is_default' => 'boolean',
                'is_active' => 'boolean',
            ]);

            // If this is set as default, remove default from others
            if (isset($validated['is_default']) && $validated['is_default']) {
                Language::where('id', '!=', $id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $language->update($validated);
            return response()->json($language);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Language not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update language'], 500);
        }
    }

    /**
     * Remove the specified language.
     */
    public function destroy($id)
    {
        try {
            $language = Language::findOrFail($id);
            
            // Prevent deleting the default language
            if ($language->is_default) {
                return response()->json([
                    'message' => 'Cannot delete the default language',
                    'error' => 'Please set another language as default before deleting this one.',
                ], 409);
            }
            
            // Check if language has translations
            $cityTranslations = $language->cityTranslations()->count();
            $currencyTranslations = $language->currencyTranslations()->count();
            
            if ($cityTranslations > 0 || $currencyTranslations > 0) {
                return response()->json([
                    'message' => 'Cannot delete language with existing translations',
                    'error' => "This language has {$cityTranslations} city translation(s) and {$currencyTranslations} currency translation(s).",
                ], 409);
            }
            
            $language->delete();
            return response()->json(['message' => 'Language deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Language not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete language'], 500);
        }
    }

    /**
     * Get the default language.
     */
    public function getDefault()
    {
        try {
            $language = Language::where('is_default', true)->first();
            
            if (!$language) {
                return response()->json(['error' => 'No default language set'], 404);
            }
            
            return response()->json($language);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch default language'], 500);
        }
    }

    /**
     * Set a language as the default.
     */
    public function setDefault($id)
    {
        try {
            $language = Language::findOrFail($id);
            
            // Remove default from all others
            Language::where('is_default', true)->update(['is_default' => false]);
            
            // Set this as default and active
            $language->update([
                'is_default' => true,
                'is_active' => true,
            ]);
            
            return response()->json($language);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Language not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to set default language'], 500);
        }
    }
}
