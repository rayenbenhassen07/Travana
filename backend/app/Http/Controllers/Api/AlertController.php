<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AlertController extends Controller
{
    /**
     * @OA\Get(
     *     path="/alerts",
     *     summary="Get all alerts",
     *     description="Retrieve a list of all alerts with listings count",
     *     operationId="getAlerts",
     *     tags={"Alerts"},
     *     @OA\Response(response=200, description="List of alerts", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Alert"))),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function index()
    {
        try {
            $alerts = Alert::withCount('listings')->get();
            return response()->json($alerts);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch alerts'], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/alerts",
     *     summary="Create a new alert",
     *     operationId="createAlert",
     *     tags={"Alerts"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"title"},
     *                 @OA\Property(property="title", type="string", maxLength=255, example="No Smoking"),
     *                 @OA\Property(property="description", type="string", nullable=true),
     *                 @OA\Property(property="logo", type="string", format="binary", description="Logo image (max 2MB)")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=201, description="Alert created", @OA\JsonContent(ref="#/components/schemas/Alert")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/alerts/{id}",
     *     summary="Get a specific alert",
     *     operationId="getAlert",
     *     tags={"Alerts"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Alert details", @OA\JsonContent(ref="#/components/schemas/Alert")),
     *     @OA\Response(response=404, description="Alert not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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

    /**
     * @OA\Put(
     *     path="/alerts/{id}",
     *     summary="Update an alert",
     *     operationId="updateAlert",
     *     tags={"Alerts"},
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
     *     @OA\Response(response=200, description="Alert updated", @OA\JsonContent(ref="#/components/schemas/Alert")),
     *     @OA\Response(response=404, description="Alert not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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

    /**
     * @OA\Delete(
     *     path="/alerts/{id}",
     *     summary="Delete an alert",
     *     operationId="deleteAlert",
     *     tags={"Alerts"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Alert deleted", @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="Alert not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=409, description="Cannot delete - has listings", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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