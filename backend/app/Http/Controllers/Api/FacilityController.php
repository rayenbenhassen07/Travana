<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class FacilityController extends Controller
{
    public function index()
    {
        try {
            $facilities = Facility::withCount('listings')->get();
            return response()->json($facilities);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch facilities'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255|unique:facilities,title',
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
                $path = $logo->storeAs('uploads/facilities', $filename, 'public');
                $data['logo'] = $path;
            }

            $facility = Facility::create($data);
            $facility->loadCount('listings');

            return response()->json($facility, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create facility'], 500);
        }
    }

    public function show($id)
    {
        try {
            $facility = Facility::withCount('listings')->findOrFail($id);
            return response()->json($facility);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Facility not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch facility'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $facility = Facility::findOrFail($id);

            $validated = $request->validate([
                'title' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('facilities', 'title')->ignore($id),
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
                if ($facility->logo && Storage::disk('public')->exists($facility->logo)) {
                    Storage::disk('public')->delete($facility->logo);
                }

                $logo = $request->file('logo');
                $filename = time() . '_' . $logo->getClientOriginalName();
                $path = $logo->storeAs('uploads/facilities', $filename, 'public');
                $data['logo'] = $path;
            }

            $facility->update($data);
            $facility->loadCount('listings');

            return response()->json($facility);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Facility not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update facility'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $facility = Facility::findOrFail($id);
            
            // Check if facility is used by any listings
            $listingsCount = $facility->listings()->count();
            if ($listingsCount > 0) {
                return response()->json([
                    'error' => "Cannot delete facility with {$listingsCount} existing listing(s)"
                ], 409);
            }

            // Delete logo if exists
            if ($facility->logo && Storage::disk('public')->exists($facility->logo)) {
                Storage::disk('public')->delete($facility->logo);
            }

            $facility->delete();
            return response()->json(['message' => 'Facility deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Facility not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete facility'], 500);
        }
    }
}