<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class FacilityController extends Controller
{
    /**
     * @OA\Get(
     *     path="/facilities",
     *     summary="Get all facilities",
     *     description="Retrieve a list of all facilities with listings count",
     *     operationId="getFacilities",
     *     tags={"Facilities"},
     *     @OA\Response(response=200, description="List of facilities", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Facility"))),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function index()
    {
        try {
            $facilities = Facility::withCount('listings')->get();
            return response()->json($facilities);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch facilities'], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/facilities",
     *     summary="Create a new facility",
     *     operationId="createFacility",
     *     tags={"Facilities"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"title"},
     *                 @OA\Property(property="title", type="string", maxLength=255, example="WiFi"),
     *                 @OA\Property(property="description", type="string", nullable=true),
     *                 @OA\Property(property="logo", type="string", format="binary", description="Logo image (max 2MB)")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=201, description="Facility created", @OA\JsonContent(ref="#/components/schemas/Facility")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/facilities/{id}",
     *     summary="Get a specific facility",
     *     operationId="getFacility",
     *     tags={"Facilities"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Facility details", @OA\JsonContent(ref="#/components/schemas/Facility")),
     *     @OA\Response(response=404, description="Facility not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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

    /**
     * @OA\Put(
     *     path="/facilities/{id}",
     *     summary="Update a facility",
     *     operationId="updateFacility",
     *     tags={"Facilities"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="title", type="string", maxLength=255),
     *                 @OA\Property(property="description", type="string", nullable=true),
     *                 @OA\Property(property="logo", type="string", format="binary")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="Facility updated", @OA\JsonContent(ref="#/components/schemas/Facility")),
     *     @OA\Response(response=404, description="Facility not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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

    /**
     * @OA\Delete(
     *     path="/facilities/{id}",
     *     summary="Delete a facility",
     *     operationId="deleteFacility",
     *     tags={"Facilities"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Facility deleted", @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="Facility not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=409, description="Cannot delete - has listings", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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