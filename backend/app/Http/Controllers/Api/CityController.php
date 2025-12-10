<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CityController extends Controller
{
    /**
     * @OA\Get(
     *     path="/cities",
     *     summary="Get all cities",
     *     description="Retrieve a list of all cities with their listings",
     *     operationId="getCities",
     *     tags={"Cities"},
     *     @OA\Response(
     *         response=200,
     *         description="List of cities",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/City"))
     *     )
     * )
     */
    public function index()
    {
        $cities = City::with('listings')->get();
        return response()->json($cities);
    }

    /**
     * @OA\Post(
     *     path="/cities",
     *     summary="Create a new city",
     *     description="Create a new city with auto-generated slug",
     *     operationId="createCity",
     *     tags={"Cities"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", maxLength=255, example="Paris"),
     *             @OA\Property(property="slug", type="string", nullable=true, example="paris")
     *         )
     *     ),
     *     @OA\Response(response=201, description="City created", @OA\JsonContent(ref="#/components/schemas/City")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:cities,name',
                'slug' => 'nullable|string|unique:cities,slug',
            ]);

            $data = $request->all();
            if (!isset($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $city = City::create($data);
            return response()->json($city, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create city',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/cities/{id}",
     *     summary="Get a specific city",
     *     description="Retrieve a single city with its listings",
     *     operationId="getCity",
     *     tags={"Cities"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="City details", @OA\JsonContent(ref="#/components/schemas/City")),
     *     @OA\Response(response=404, description="City not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function show($id)
    {
        $city = City::with('listings')->findOrFail($id);
        return response()->json($city);
    }

    /**
     * @OA\Put(
     *     path="/cities/{id}",
     *     summary="Update a city",
     *     description="Update an existing city",
     *     operationId="updateCity",
     *     tags={"Cities"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", maxLength=255),
     *             @OA\Property(property="slug", type="string", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=200, description="City updated", @OA\JsonContent(ref="#/components/schemas/City")),
     *     @OA\Response(response=404, description="City not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $city = City::findOrFail($id);

            $request->validate([
                'name' => 'sometimes|required|string|max:255|unique:cities,name,' . $id,
                'slug' => 'nullable|string|unique:cities,slug,' . $id,
            ]);

            $data = $request->all();
            if (isset($data['name']) && !isset($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $city->update($data);
            return response()->json($city);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'City not found',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update city',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/cities/{id}",
     *     summary="Delete a city",
     *     description="Delete a city (only if no listings exist)",
     *     operationId="deleteCity",
     *     tags={"Cities"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="City deleted", @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="City not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=409, description="Cannot delete - has listings", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function destroy($id)
    {
        try {
            $city = City::findOrFail($id);
            
            // Check if city has listings
            if ($city->listings()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete city with existing listings',
                    'error' => 'This city has ' . $city->listings()->count() . ' listing(s) associated with it.',
                ], 409);
            }
            
            $city->delete();
            return response()->json(['message' => 'City deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'City not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete city',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}