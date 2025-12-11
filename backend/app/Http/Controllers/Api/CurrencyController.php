<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CurrencyController extends Controller
{
    public function index(Request $request)
    {
        try {
            $languageCode = $request->input('lang', 'en');
            
            $currencies = Currency::with('translations.language')
                ->where('is_active', true)
                ->get()
                ->map(function ($currency) use ($languageCode) {
                    return $this->formatCurrencyResponse($currency, $languageCode);
                });
                
            return response()->json($currencies);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch currencies'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'code' => 'required|string|max:10|unique:currencies,code',
                'symbol' => 'required|string|max:10',
                'exchange_rate' => 'required|numeric|min:0',
                'is_default' => 'boolean',
                'is_active' => 'boolean',
                'translations' => 'required|array|min:1',
                'translations.*.language_code' => 'required|string|exists:languages,code',
                'translations.*.name' => 'required|string|max:255',
            ]);

            DB::beginTransaction();

            $currency = Currency::create([
                'code' => $validated['code'],
                'symbol' => $validated['symbol'],
                'exchange_rate' => $validated['exchange_rate'],
                'is_default' => $validated['is_default'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Create translations
            foreach ($validated['translations'] as $translation) {
                $language = Language::where('code', $translation['language_code'])->first();
                $currency->translations()->create([
                    'language_id' => $language->id,
                    'name' => $translation['name'],
                ]);
            }

            DB::commit();

            $languageCode = $request->input('lang', 'en');
            return response()->json(
                $this->formatCurrencyResponse($currency->fresh(['translations.language']), $languageCode),
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
            return response()->json(['error' => 'Failed to create currency'], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $languageCode = $request->input('lang', 'en');
            $currency = Currency::with('translations.language')->findOrFail($id);
            
            return response()->json($this->formatCurrencyResponse($currency, $languageCode));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Currency not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch currency'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $currency = Currency::findOrFail($id);

            $validated = $request->validate([
                'code' => 'sometimes|required|string|max:10|unique:currencies,code,' . $id,
                'symbol' => 'sometimes|required|string|max:10',
                'exchange_rate' => 'sometimes|required|numeric|min:0',
                'is_default' => 'boolean',
                'is_active' => 'boolean',
                'translations' => 'sometimes|array|min:1',
                'translations.*.language_code' => 'required_with:translations|string|exists:languages,code',
                'translations.*.name' => 'required_with:translations|string|max:255',
            ]);

            DB::beginTransaction();

            // Update currency data
            $currency->update([
                'code' => $validated['code'] ?? $currency->code,
                'symbol' => $validated['symbol'] ?? $currency->symbol,
                'exchange_rate' => $validated['exchange_rate'] ?? $currency->exchange_rate,
                'is_default' => $validated['is_default'] ?? $currency->is_default,
                'is_active' => $validated['is_active'] ?? $currency->is_active,
            ]);

            // Update translations if provided
            if (isset($validated['translations'])) {
                foreach ($validated['translations'] as $translation) {
                    $language = Language::where('code', $translation['language_code'])->first();
                    $currency->translations()->updateOrCreate(
                        ['language_id' => $language->id],
                        ['name' => $translation['name']]
                    );
                }
            }

            DB::commit();

            $languageCode = $request->input('lang', 'en');
            return response()->json(
                $this->formatCurrencyResponse($currency->fresh(['translations.language']), $languageCode)
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json(['error' => 'Currency not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update currency'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $currency = Currency::findOrFail($id);
            
            // Check if currency has reservations
            if ($currency->listingReservations()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete currency with existing reservations',
                    'error' => 'This currency has ' . $currency->listingReservations()->count() . ' reservation(s) associated with it.',
                ], 409);
            }
            
            $currency->delete();
            return response()->json(['message' => 'Currency deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Currency not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete currency'], 500);
        }
    }

    /**
     * Format currency response with translations
     */
    private function formatCurrencyResponse($currency, $languageCode = 'en')
    {
        $translations = [];
        foreach ($currency->translations as $translation) {
            $translations[$translation->language->code] = $translation->name;
        }

        return [
            'id' => $currency->id,
            'code' => $currency->code,
            'symbol' => $currency->symbol,
            'exchange_rate' => $currency->exchange_rate,
            'is_default' => $currency->is_default,
            'is_active' => $currency->is_active,
            'name' => $currency->getTranslatedName($languageCode) ?? $translations['en'] ?? null,
            'translations' => $translations,
            'created_at' => $currency->created_at,
            'updated_at' => $currency->updated_at,
        ];
    }
}
