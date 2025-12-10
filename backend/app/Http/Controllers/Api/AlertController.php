<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AlertController extends Controller
{
    public function index()
    {
        try {
            $alerts = Alert::withCount('listings')->get();
            return response()->json($alerts);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch alerts'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255|unique:alerts,title',
                'description' => 'nullable|string',
                'logo' => 'nullable|file|mimes:jpeg,jpg,png,gif,svg|max:2048',
            ]);

            $data = [
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
            ];

            // Handle logo upload
            if ($request->hasFile('logo')) {
                $logo = $request->file('logo');
                $filename = time() . '_' . $logo->getClientOriginalName();
                $path = $logo->storeAs('uploads/alerts', $filename, 'public');
                $data['logo'] = $path;
            }

            $alert = Alert::create($data);
            $alert->loadCount('listings');

            return response()->json($alert, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create alert'], 500);
        }
    }

    public function show($id)
    {
        try {
            $alert = Alert::withCount('listings')->findOrFail($id);
            return response()->json($alert);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Alert not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch alert'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $alert = Alert::findOrFail($id);

            $validated = $request->validate([
                'title' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('alerts', 'title')->ignore($id),
                ],
                'description' => 'nullable|string',
                'logo' => 'nullable|file|mimes:jpeg,jpg,png,gif,svg|max:2048',
            ]);

            $data = [];
            
            if (isset($validated['title'])) {
                $data['title'] = $validated['title'];
            }
            
            if ($request->has('description')) {
                $data['description'] = $validated['description'] ?? null;
            }

            // Handle logo upload
            if ($request->hasFile('logo')) {
                // Delete old logo if exists
                if ($alert->logo && Storage::disk('public')->exists($alert->logo)) {
                    Storage::disk('public')->delete($alert->logo);
                }

                $logo = $request->file('logo');
                $filename = time() . '_' . $logo->getClientOriginalName();
                $path = $logo->storeAs('uploads/alerts', $filename, 'public');
                $data['logo'] = $path;
            }

            $alert->update($data);
            $alert->loadCount('listings');

            return response()->json($alert);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Alert not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update alert'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $alert = Alert::findOrFail($id);
            
            // Check if alert is used by any listings
            $listingsCount = $alert->listings()->count();
            if ($listingsCount > 0) {
                return response()->json([
                    'error' => "Cannot delete alert with {$listingsCount} existing listing(s)"
                ], 409);
            }

            // Delete logo if exists
            if ($alert->logo && Storage::disk('public')->exists($alert->logo)) {
                Storage::disk('public')->delete($alert->logo);
            }

            $alert->delete();
            return response()->json(['message' => 'Alert deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Alert not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete alert'], 500);
        }
    }
}
