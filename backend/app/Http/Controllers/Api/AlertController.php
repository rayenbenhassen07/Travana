<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\AlertTranslation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AlertController extends Controller
{
    private function formatAlertResponse($alert)
    {
        $translations = $alert->translations->map(function ($translation) {
            return [
                'language_id' => $translation->language_id,
                'language_code' => $translation->language->code ?? null,
                'name' => $translation->name,
                'description' => $translation->description,
            ];
        })->values()->toArray();

        return [
            'id' => $alert->id,
            'slug' => $alert->slug,
            'icon' => $alert->icon,
            'is_active' => $alert->is_active,
            'sort_order' => $alert->sort_order,
            'name' => $alert->translations->first()->name ?? null,
            'description' => $alert->translations->first()->description ?? null,
            'translations' => $translations,
        ];
    }

    public function index(Request $request)
    {
        try {
            $query = Alert::with(['translations.language'])
                ->orderBy('sort_order');

            // Filter by active status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->boolean('is_active'));
            }

            $alerts = $query->get()->map(function ($alert) {
                return $this->formatAlertResponse($alert);
            });

            return response()->json($alerts);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch alerts: ' . $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $alert = Alert::with(['translations.language'])->findOrFail($id);
            return response()->json($this->formatAlertResponse($alert));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Alert not found'], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,ico|max:2048',
                'is_active' => 'boolean',
                'sort_order' => 'integer',
                'translations' => 'required|array|min:1',
                'translations.*.language_code' => 'required|string|exists:languages,code',
                'translations.*.name' => 'required|string|max:255',
                'translations.*.description' => 'nullable|string',
            ]);

            DB::beginTransaction();

            // Handle icon upload
            $iconPath = null;
            if ($request->hasFile('icon')) {
                $iconPath = $request->file('icon')->store('alerts', 'public');
            }

            // Generate slug from first translation name
            $slug = Str::slug($validated['translations'][0]['name']);

            $alert = Alert::create([
                'slug' => $slug,
                'icon' => $iconPath,
                'is_active' => $validated['is_active'] ?? true,
                'sort_order' => $validated['sort_order'] ?? 0,
            ]);

            foreach ($validated['translations'] as $translation) {
                $language = \App\Models\Language::where('code', $translation['language_code'])->first();
                
                if ($language) {
                    AlertTranslation::create([
                        'alert_id' => $alert->id,
                        'language_id' => $language->id,
                        'name' => $translation['name'],
                        'description' => $translation['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            $alert->load('translations.language');
            return response()->json($this->formatAlertResponse($alert), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create alert: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $alert = Alert::findOrFail($id);

            $validated = $request->validate([
                'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,ico|max:2048',
                'is_active' => 'boolean',
                'sort_order' => 'integer',
                'translations' => 'required|array|min:1',
                'translations.*.language_code' => 'required|string|exists:languages,code',
                'translations.*.name' => 'required|string|max:255',
                'translations.*.description' => 'nullable|string',
            ]);

            DB::beginTransaction();

            // Handle icon upload
            $iconPath = $alert->icon;
            if ($request->hasFile('icon')) {
                // Delete old icon
                if ($alert->icon) {
                    Storage::disk('public')->delete($alert->icon);
                }
                $iconPath = $request->file('icon')->store('alerts', 'public');
            }

            // Generate slug from first translation name
            $slug = Str::slug($validated['translations'][0]['name']);

            $alert->update([
                'slug' => $slug,
                'icon' => $iconPath,
                'is_active' => $validated['is_active'] ?? $alert->is_active,
                'sort_order' => $validated['sort_order'] ?? $alert->sort_order,
            ]);

            // Delete existing translations and create new ones
            $alert->translations()->delete();

            foreach ($validated['translations'] as $translation) {
                $language = \App\Models\Language::where('code', $translation['language_code'])->first();
                
                if ($language) {
                    AlertTranslation::create([
                        'alert_id' => $alert->id,
                        'language_id' => $language->id,
                        'name' => $translation['name'],
                        'description' => $translation['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            $alert->load('translations.language');
            return response()->json($this->formatAlertResponse($alert));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update alert: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $alert = Alert::findOrFail($id);
            
            // Delete icon file if exists
            if ($alert->icon) {
                Storage::disk('public')->delete($alert->icon);
            }
            
            $alert->delete();
            return response()->json(['message' => 'Alert deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete alert: ' . $e->getMessage()], 500);
        }
    }
}
