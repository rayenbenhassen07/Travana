<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CityController extends Controller
{
    public function index()
    {
        $cities = City::with('listings')->get();
        return response()->json($cities);
    }

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

    public function show($id)
    {
        $city = City::with('listings')->findOrFail($id);
        return response()->json($city);
    }

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